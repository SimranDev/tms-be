import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UserJwtAuthGuard } from '../auth/user-auth/guards/user-jwt-auth.guard';

@Controller('customers')
@UseGuards(UserJwtAuthGuard)
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  async createCustomer(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customerService.createCustomer(createCustomerDto);
  }

  @Get(':id')
  async findCustomerById(@Param('id') id: string) {
    return this.customerService.findCustomerById(id);
  }

  @Get()
  async findAllCustomers() {
    return this.customerService.findAllCustomers();
  }

  @Put(':id')
  async updateCustomer(
    @Param('id') id: string,
    @Body() updateCustomerDto: Partial<CreateCustomerDto>,
  ) {
    return this.customerService.updateCustomer(id, updateCustomerDto);
  }

  @Delete(':id')
  async deleteCustomer(@Param('id') id: string) {
    return this.customerService.deleteCustomer(id);
  }

  @Get(':id/jobs')
  async findCustomerJobs(@Param('id') id: string) {
    return this.customerService.findCustomerJobs(id);
  }
}
