import { Controller, Get, UseGuards, Logger } from '@nestjs/common';
import { LocationService } from './location.service';
import { UserJwtAuthGuard } from '../auth/user-auth/guards/user-jwt-auth.guard';
import { DriverLocationResponse } from './location.gateway';

@Controller('locations')
@UseGuards(UserJwtAuthGuard)
export class LocationController {
  private readonly logger = new Logger(LocationController.name);

  constructor(private readonly locationService: LocationService) {}

  @Get('current')
  getCurrentDriverLocations(): {
    success: boolean;
    drivers: DriverLocationResponse[];
    count: number;
    timestamp: Date;
  } {
    const locations = this.locationService.getCurrentDriverLocations();
    this.logger.log(
      `📍 API request: returning ${locations.length} driver locations`,
    );

    return {
      success: true,
      drivers: locations,
      count: locations.length,
      timestamp: new Date(),
    };
  }

  @Get('stats')
  getConnectionStats() {
    const stats = this.locationService.getConnectionStats();
    this.logger.log('📊 API request: connection statistics');

    return {
      success: true,
      data: stats,
      timestamp: new Date(),
    };
  }

  @Get('count')
  getDriverCount() {
    const count = this.locationService.getDriverCount();
    this.logger.log(
      `🔢 API request: driver count - ${count.total} total, ${count.active} active`,
    );

    return {
      success: true,
      data: count,
      timestamp: new Date(),
    };
  }
}
