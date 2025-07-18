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
import { ContainerService } from './container.service';
import { CreateContainerDto } from './dto/create-container.dto';
import { UserJwtAuthGuard } from '../auth/user-auth/guards/user-jwt-auth.guard';

@Controller('containers')
@UseGuards(UserJwtAuthGuard)
export class ContainerController {
  constructor(private readonly containerService: ContainerService) {}

  @Post()
  async createContainer(@Body() createContainerDto: CreateContainerDto) {
    return this.containerService.createContainer(createContainerDto);
  }

  @Get(':id')
  async findContainerById(@Param('id') id: string) {
    return this.containerService.findContainerById(id);
  }

  @Get()
  async findAllContainers() {
    return this.containerService.findAllContainers();
  }

  @Put(':id')
  async updateContainer(
    @Param('id') id: string,
    @Body() updateContainerDto: Partial<CreateContainerDto>,
  ) {
    return this.containerService.updateContainer(id, updateContainerDto);
  }

  @Delete(':id')
  async deleteContainer(@Param('id') id: string) {
    return this.containerService.deleteContainer(id);
  }
}
