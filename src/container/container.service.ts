import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContainerDto } from './dto/create-container.dto';

@Injectable()
export class ContainerService {
  constructor(private readonly prisma: PrismaService) {}

  async createContainer(createContainerDto: CreateContainerDto) {
    return this.prisma.container.create({
      data: createContainerDto,
    });
  }

  async findContainerById(id: string) {
    return this.prisma.container.findUnique({
      where: { id },
    });
  }

  async findAllContainers() {
    return this.prisma.container.findMany();
  }

  async updateContainer(
    id: string,
    updateContainerDto: Partial<CreateContainerDto>,
  ) {
    return this.prisma.container.update({
      where: { id },
      data: updateContainerDto,
    });
  }

  async deleteContainer(id: string) {
    return this.prisma.container.delete({
      where: { id },
    });
  }
}
