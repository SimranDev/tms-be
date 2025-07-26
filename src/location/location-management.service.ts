import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { CreateCustomerLocationDto } from './dto/create-customer-location.dto';

@Injectable()
export class LocationManagementService {
  constructor(private readonly prisma: PrismaService) {}

  async createLocation(createLocationDto: CreateLocationDto) {
    const data = {
      ...createLocationDto,
      herePlaceId: createLocationDto.herePlaceId,
    };

    return this.prisma.location.create({
      data,
    });
  }

  async findAllLocations() {
    return this.prisma.location.findMany({
      include: {
        customers: {
          include: {
            customer: {
              select: {
                id: true,
                companyName: true,
              },
            },
          },
        },
        pickupJobs: {
          select: {
            id: true,
            status: true,
          },
        },
        deliveryJobs: {
          select: {
            id: true,
            status: true,
          },
        },
      },
    });
  }

  async findLocationById(id: string) {
    const location = await this.prisma.location.findUnique({
      where: { id },
      include: {
        customers: {
          include: {
            customer: {
              select: {
                id: true,
                companyName: true,
                contactPerson: true,
                email: true,
                phoneNumber: true,
              },
            },
          },
        },
        pickupJobs: {
          include: {
            customer: {
              select: {
                companyName: true,
              },
            },
            driver: {
              select: {
                firstname: true,
                lastname: true,
              },
            },
          },
        },
        deliveryJobs: {
          include: {
            customer: {
              select: {
                companyName: true,
              },
            },
            driver: {
              select: {
                firstname: true,
                lastname: true,
              },
            },
          },
        },
        customerAddress: {
          select: {
            id: true,
            companyName: true,
          },
        },
      },
    });

    if (!location) {
      throw new NotFoundException(`Location with ID ${id} not found`);
    }

    return location;
  }

  async updateLocation(
    id: string,
    updateLocationDto: Partial<CreateLocationDto>,
  ) {
    const location = await this.prisma.location.findUnique({
      where: { id },
    });

    if (!location) {
      throw new NotFoundException(`Location with ID ${id} not found`);
    }

    return this.prisma.location.update({
      where: { id },
      data: updateLocationDto,
    });
  }

  async deleteLocation(id: string) {
    const location = await this.prisma.location.findUnique({
      where: { id },
    });

    if (!location) {
      throw new NotFoundException(`Location with ID ${id} not found`);
    }

    return this.prisma.location.delete({
      where: { id },
    });
  }

  // Customer-Location relationship management
  async addCustomerLocation(
    createCustomerLocationDto: CreateCustomerLocationDto,
  ) {
    return this.prisma.customerLocation.create({
      data: createCustomerLocationDto,
      include: {
        customer: {
          select: {
            companyName: true,
          },
        },
        location: true,
      },
    });
  }

  async removeCustomerLocation(customerId: string, locationId: string) {
    const customerLocation = await this.prisma.customerLocation.findUnique({
      where: {
        customerId_locationId: {
          customerId,
          locationId,
        },
      },
    });

    if (!customerLocation) {
      throw new NotFoundException('Customer-Location relationship not found');
    }

    return this.prisma.customerLocation.delete({
      where: {
        customerId_locationId: {
          customerId,
          locationId,
        },
      },
    });
  }

  async findCustomerLocations(customerId: string) {
    return this.prisma.customerLocation.findMany({
      where: { customerId },
      include: {
        location: true,
      },
    });
  }
}
