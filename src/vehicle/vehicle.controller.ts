import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { CreateVehicleDto } from './dto/crdate-vehicle.dto';
import { UserJwtAuthGuard } from '../auth/user-auth/guards/user-jwt-auth.guard';

@Controller('vehicles')
@UseGuards(UserJwtAuthGuard)
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Post()
  async createVehicle(@Body() createVehicleDto: CreateVehicleDto) {
    return this.vehicleService.createVehicle(createVehicleDto);
  }

  @Get(':id')
  async findVehicleById(@Param('id') id: string) {
    return this.vehicleService.findVehicleById(id);
  }

  @Get()
  async findAllVehicles() {
    return this.vehicleService.findAllVehicles();
  }

  @Post(':id')
  async updateVehicle(
    @Param('id') id: string,
    @Body() updateVehicleDto: Partial<CreateVehicleDto>,
  ) {
    return this.vehicleService.updateVehicle(id, updateVehicleDto);
  }
}
