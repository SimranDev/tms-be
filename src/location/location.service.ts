import { Injectable, Logger } from '@nestjs/common';
import { LocationGateway, DriverLocationResponse } from './location.gateway';

@Injectable()
export class LocationService {
  private readonly logger = new Logger(LocationService.name);

  constructor(private readonly locationGateway: LocationGateway) {
    // Start periodic cleanup every 10 minutes
    setInterval(
      () => {
        this.handleInactiveDriverCleanup();
      },
      10 * 60 * 1000,
    ); // 10 minutes

    // Log stats every hour
    setInterval(
      () => {
        this.logConnectionStats();
      },
      60 * 60 * 1000,
    ); // 1 hour
  }

  getCurrentDriverLocations(): DriverLocationResponse[] {
    return this.locationGateway.getCurrentDriverLocations();
  }

  getConnectionStats() {
    return this.locationGateway.getConnectionStats();
  }

  getDriverCount() {
    const stats = this.getConnectionStats();
    return {
      total: stats.totalConnectedDrivers,
      active: stats.activeDriversWithLocation,
      admins: stats.connectedAdmins,
    };
  }

  // Cleanup inactive drivers
  private handleInactiveDriverCleanup() {
    this.logger.log('Running scheduled cleanup of inactive drivers');
    this.locationGateway.cleanupInactiveDrivers();
  }

  // Log statistics for monitoring
  private logConnectionStats() {
    const stats = this.getConnectionStats();
    this.logger.log(
      `📊 Connection Stats: ${stats.totalConnectedDrivers} drivers connected, ` +
        `${stats.activeDriversWithLocation} with recent locations, ` +
        `${stats.connectedAdmins} admins online`,
    );
  }
}
