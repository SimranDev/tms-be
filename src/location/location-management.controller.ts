import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { UserJwtAuthGuard } from '../auth/user-auth/guards/user-jwt-auth.guard';
import { LocationManagementService } from './location-management.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { CreateCustomerLocationDto } from './dto/create-customer-location.dto';

@Controller('locations')
@UseGuards(UserJwtAuthGuard)
export class LocationManagementController {
  constructor(
    private readonly locationManagementService: LocationManagementService,
  ) {}

  @Post()
  async createLocation(@Body() createLocationDto: CreateLocationDto) {
    return this.locationManagementService.createLocation(createLocationDto);
  }

  @Get()
  async findAllLocations() {
    return this.locationManagementService.findAllLocations();
  }

  @Get(':id')
  async findLocationById(@Param('id') id: string) {
    return this.locationManagementService.findLocationById(id);
  }

  @Put(':id')
  async updateLocation(
    @Param('id') id: string,
    @Body() updateLocationDto: Partial<CreateLocationDto>,
  ) {
    return this.locationManagementService.updateLocation(id, updateLocationDto);
  }

  @Delete(':id')
  async deleteLocation(@Param('id') id: string) {
    return this.locationManagementService.deleteLocation(id);
  }

  // Customer-Location relationship endpoints
  @Post('customer-locations')
  async addCustomerLocation(
    @Body() createCustomerLocationDto: CreateCustomerLocationDto,
  ) {
    return this.locationManagementService.addCustomerLocation(
      createCustomerLocationDto,
    );
  }

  @Delete('customer-locations/:customerId/:locationId')
  async removeCustomerLocation(
    @Param('customerId') customerId: string,
    @Param('locationId') locationId: string,
  ) {
    return this.locationManagementService.removeCustomerLocation(
      customerId,
      locationId,
    );
  }

  @Get('customers/:customerId/locations')
  async findCustomerLocations(@Param('customerId') customerId: string) {
    return this.locationManagementService.findCustomerLocations(customerId);
  }
}
