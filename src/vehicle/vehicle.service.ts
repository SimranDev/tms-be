import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateVehicleDto } from './dto/crdate-vehicle.dto';

@Injectable()
export class VehicleService {
  constructor(private readonly prisma: PrismaService) {}

  async createVehicle(data: CreateVehicleDto) {
    return this.prisma.vehicle.create({ data });
  }

  async findVehicleById(id: string) {
    return this.prisma.vehicle.findUnique({
      where: { id },
    });
  }

  async updateVehicle(id: string, data: Partial<CreateVehicleDto>) {
    return this.prisma.vehicle.update({
      where: { id },
      data,
    });
  }

  async deleteVehicle(id: string) {
    return this.prisma.vehicle.delete({
      where: { id },
    });
  }

  async findAllVehicles() {
    return this.prisma.vehicle.findMany();
  }
}
