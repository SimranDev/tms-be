import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';

@Injectable()
export class CustomerService {
  constructor(private readonly prisma: PrismaService) {}

  async createCustomer(createCustomerDto: CreateCustomerDto) {
    return this.prisma.customer.create({
      data: createCustomerDto,
    });
  }

  async findCustomerById(id: string) {
    return this.prisma.customer.findUnique({
      where: { id },
      include: {
        jobs: {
          include: {
            driver: {
              select: {
                id: true,
                firstname: true,
                lastname: true,
              },
            },
            vehicle: {
              select: {
                id: true,
                name: true,
                rego: true,
              },
            },
            container: {
              select: {
                id: true,
                containerNumber: true,
                type: true,
                size: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });
  }

  async findAllCustomers() {
    return this.prisma.customer.findMany({
      include: {
        _count: {
          select: {
            jobs: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async updateCustomer(
    id: string,
    updateCustomerDto: Partial<CreateCustomerDto>,
  ) {
    return this.prisma.customer.update({
      where: { id },
      data: updateCustomerDto,
    });
  }

  async deleteCustomer(id: string) {
    return this.prisma.customer.delete({
      where: { id },
    });
  }

  async findCustomerJobs(id: string) {
    return this.prisma.job.findMany({
      where: { customerId: id },
      include: {
        driver: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
          },
        },
        vehicle: {
          select: {
            id: true,
            name: true,
            rego: true,
          },
        },
        container: {
          select: {
            id: true,
            containerNumber: true,
            type: true,
            size: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
