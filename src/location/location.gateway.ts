import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';

interface JwtPayload {
  sub: string;
  email: string;
  type: 'driver' | 'user';
}

interface ClientData {
  userId: string;
  userType: 'driver' | 'admin';
}

interface LocationUpdate {
  driverId: string;
  latitude: number;
  longitude: number;
  timestamp: Date;
  speed?: number;
  heading?: number;
}

interface DriverConnection {
  driverId: string;
  socket: Socket;
  lastLocation: LocationUpdate | null;
  lastSeen: Date;
  driverInfo: {
    firstname: string;
    lastname: string;
    isActive: boolean;
  };
}

interface JwtPayload {
  sub: string;
  type: 'user' | 'driver';
  iat?: number;
  exp?: number;
}

interface ClientData {
  userId: string;
  userType: 'driver' | 'admin';
}

export interface DriverLocationResponse {
  driverId: string;
  driverName: string;
  latitude: number;
  longitude: number;
  speed?: number;
  heading?: number;
  timestamp: Date;
  lastSeen: Date;
  isActive: boolean;
}

@WebSocketGateway({
  cors: {
    origin: [
      'http://localhost:3000',
      'http://localhost:5173',
      'http://127.0.0.1:5173',
    ],
    credentials: true,
  },
})
@Injectable()
export class LocationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(LocationGateway.name);

  // In-memory storage - no database or Redis
  private activeDrivers = new Map<string, DriverConnection>();
  private adminClients = new Set<Socket>();

  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {
    this.logger.log('Location Gateway initialized - Memory-only tracking');
  }

  async handleConnection(client: Socket): Promise<void> {
    try {
      // Safely extract token with proper type checking
      const auth = client.handshake.auth as Record<string, unknown> | undefined;
      const authToken = auth?.token;
      const headerToken = client.handshake.headers.authorization;

      const token =
        (typeof authToken === 'string' ? authToken : undefined) ||
        (typeof headerToken === 'string'
          ? headerToken.split(' ')[1]
          : undefined);

      if (!token || typeof token !== 'string') {
        throw new UnauthorizedException('No token provided');
      }

      // JWT verify returns any, need to type it safely
      const payload: unknown = this.jwtService.verify(token);
      const jwtPayload = payload as JwtPayload;
      const userType = jwtPayload.type;

      if (userType === 'driver') {
        await this.handleDriverConnection(client, jwtPayload);
      } else if (userType === 'user') {
        await this.handleAdminConnection(client, jwtPayload);
      } else {
        throw new UnauthorizedException('Invalid user type');
      }
    } catch (error) {
      this.logger.error('WebSocket connection error:', error);
      client.disconnect();
    }
  }

  private async handleDriverConnection(
    client: Socket,
    payload: JwtPayload,
  ): Promise<void> {
    // Verify driver exists and get info
    const driver = await this.prisma.driver.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        firstname: true,
        lastname: true,
        isActive: true,
      },
    });

    if (!driver) {
      throw new UnauthorizedException('Driver not found');
    }

    // Store driver connection
    this.activeDrivers.set(client.id, {
      driverId: payload.sub,
      socket: client,
      lastLocation: null,
      lastSeen: new Date(),
      driverInfo: {
        firstname: driver.firstname,
        lastname: driver.lastname,
        isActive: driver.isActive,
      },
    });

    // Store user info in socket data
    const clientData = client.data as ClientData;
    clientData.userId = payload.sub;
    clientData.userType = 'driver';

    this.logger.log(
      `🚛 Driver ${driver.firstname} ${driver.lastname} connected`,
    );

    // Notify admins that a driver came online
    this.broadcastToAdmins('driver_connected', {
      driverId: payload.sub,
      driverName: `${driver.firstname} ${driver.lastname}`,
      timestamp: new Date(),
    });
  }

  private async handleAdminConnection(
    client: Socket,
    payload: JwtPayload,
  ): Promise<void> {
    // Verify admin user exists
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, firstname: true, lastname: true },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    this.adminClients.add(client);
    // Store user info in socket data
    const clientData = client.data as ClientData;
    clientData.userId = payload.sub;
    clientData.userType = 'admin';

    this.logger.log(`👨‍💼 Admin ${user.firstname} ${user.lastname} connected`);

    // Send current driver locations to new admin
    const currentLocations = this.getCurrentDriverLocations();
    client.emit('current_driver_locations', {
      drivers: currentLocations,
      count: currentLocations.length,
      timestamp: new Date(),
    });
  }

  handleDisconnect(client: Socket): void {
    const driverConnection = this.activeDrivers.get(client.id);

    if (driverConnection) {
      // Driver disconnected
      this.activeDrivers.delete(client.id);
      this.logger.log(
        `🚛 Driver ${driverConnection.driverInfo.firstname} ${driverConnection.driverInfo.lastname} disconnected`,
      );

      // Notify admins
      this.broadcastToAdmins('driver_disconnected', {
        driverId: driverConnection.driverId,
        driverName: `${driverConnection.driverInfo.firstname} ${driverConnection.driverInfo.lastname}`,
        timestamp: new Date(),
      });
    }

    // Remove from admin clients
    this.adminClients.delete(client);

    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('location_update')
  handleLocationUpdate(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: Omit<LocationUpdate, 'driverId' | 'timestamp'>,
  ) {
    const driverConnection = this.activeDrivers.get(client.id);

    if (!driverConnection) {
      return { error: 'Driver connection not found' };
    }

    const clientData = client.data as ClientData;
    if (clientData.userType !== 'driver') {
      return { error: 'Only drivers can send location updates' };
    }

    // Validate location data
    if (!data.latitude || !data.longitude) {
      return { error: 'Latitude and longitude are required' };
    }

    const locationUpdate: LocationUpdate = {
      driverId: driverConnection.driverId,
      latitude: data.latitude,
      longitude: data.longitude,
      timestamp: new Date(),
      speed: data.speed || 0,
      heading: data.heading || 0,
    };

    // Update driver connection with latest location (in memory only)
    driverConnection.lastLocation = locationUpdate;
    driverConnection.lastSeen = new Date();

    // Broadcast to all admin users in real-time
    this.broadcastToAdmins('driver_location_update', {
      ...locationUpdate,
      driverName: `${driverConnection.driverInfo.firstname} ${driverConnection.driverInfo.lastname}`,
      isActive: driverConnection.driverInfo.isActive,
    });

    this.logger.debug(
      `📍 Location update from ${driverConnection.driverInfo.firstname}: ${locationUpdate.latitude.toFixed(4)}, ${locationUpdate.longitude.toFixed(4)}`,
    );

    return {
      success: true,
      timestamp: locationUpdate.timestamp,
      message: 'Location updated successfully',
    };
  }

  @SubscribeMessage('get_driver_locations')
  handleGetDriverLocations(@ConnectedSocket() client: Socket) {
    const clientData = client.data as ClientData;
    if (clientData.userType !== 'admin') {
      return { error: 'Only admins can request driver locations' };
    }

    const locations = this.getCurrentDriverLocations();

    return {
      success: true,
      drivers: locations,
      count: locations.length,
      timestamp: new Date(),
    };
  }

  @SubscribeMessage('ping')
  handlePing(@ConnectedSocket() client: Socket) {
    const connection = this.activeDrivers.get(client.id);
    if (connection) {
      connection.lastSeen = new Date();
    }
    return { pong: new Date() };
  }

  // Helper method to broadcast to all admin clients
  private broadcastToAdmins(event: string, data: any): void {
    this.adminClients.forEach((adminSocket) => {
      adminSocket.emit(event, data);
    });
  }

  // Get current locations of all active drivers (memory-based)
  getCurrentDriverLocations(): DriverLocationResponse[] {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const locations: DriverLocationResponse[] = [];

    this.activeDrivers.forEach((driver) => {
      // Only include drivers that have sent location and are recently active
      if (driver.lastLocation && driver.lastSeen > fiveMinutesAgo) {
        locations.push({
          driverId: driver.driverId,
          driverName: `${driver.driverInfo.firstname} ${driver.driverInfo.lastname}`,
          latitude: driver.lastLocation.latitude,
          longitude: driver.lastLocation.longitude,
          speed: driver.lastLocation.speed,
          heading: driver.lastLocation.heading,
          timestamp: driver.lastLocation.timestamp,
          lastSeen: driver.lastSeen,
          isActive: driver.driverInfo.isActive,
        });
      }
    });

    return locations;
  }

  // Get connection statistics
  getConnectionStats() {
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);

    let activeDriversWithLocation = 0;
    let totalConnectedDrivers = 0;

    this.activeDrivers.forEach((driver) => {
      totalConnectedDrivers++;
      if (driver.lastLocation && driver.lastSeen > fiveMinutesAgo) {
        activeDriversWithLocation++;
      }
    });

    return {
      totalConnectedDrivers,
      activeDriversWithLocation,
      connectedAdmins: this.adminClients.size,
      timestamp: now,
    };
  }

  // Manual cleanup method (called periodically)
  cleanupInactiveDrivers(): void {
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
    let removedCount = 0;

    for (const [socketId, driver] of this.activeDrivers.entries()) {
      if (driver.lastSeen < tenMinutesAgo) {
        this.activeDrivers.delete(socketId);
        removedCount++;

        // Notify admins of cleanup
        this.broadcastToAdmins('driver_disconnected', {
          driverId: driver.driverId,
          driverName: `${driver.driverInfo.firstname} ${driver.driverInfo.lastname}`,
          timestamp: new Date(),
          reason: 'inactive',
        });
      }
    }

    if (removedCount > 0) {
      this.logger.log(`🧹 Cleaned up ${removedCount} inactive drivers`);
    }
  }
}
