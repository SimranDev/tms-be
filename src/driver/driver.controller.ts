import { Controller, Get, UseGuards } from '@nestjs/common';
import { DriverService } from './driver.service';
import { UserJwtAuthGuard } from 'src/auth/user-auth/guards/user-jwt-auth.guard';

@Controller('drivers')
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  @Get()
  @UseGuards(UserJwtAuthGuard)
  getAllDrivers() {
    return this.driverService.findAll();
  }
}
