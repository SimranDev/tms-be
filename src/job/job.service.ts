import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJobDto } from './dto/create-job.dto';
import { JobStatus } from '@prisma/client';

@Injectable()
export class JobService {
  constructor(private readonly prisma: PrismaService) {}

  async createJob(createJobDto: CreateJobDto, createdByUserId: string) {
    return this.prisma.job.create({
      data: {
        ...createJobDto,
        createdByUserId,
        scheduledPickup: new Date(createJobDto.scheduledPickup),
        scheduledDelivery: new Date(createJobDto.scheduledDelivery),
        actualPickup: createJobDto.actualPickup
          ? new Date(createJobDto.actualPickup)
          : null,
        actualDelivery: createJobDto.actualDelivery
          ? new Date(createJobDto.actualDelivery)
          : null,
      },
      // include: {
      //   customer: true,
      //   container: true,
      //   driver: true,
      //   vehicle: true,
      //   createdByUser: {
      //     select: {
      //       id: true,
      //       firstname: true,
      //       lastname: true,
      //       email: true,
      //     },
      //   },
      // },
    });
  }

  async findJobById(id: number) {
    return this.prisma.job.findUnique({
      where: { id },
      include: {
        customer: true,
        container: true,
        driver: true,
        vehicle: true,
        createdByUser: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            email: true,
          },
        },
      },
    });
  }

  async findAllJobs() {
    return this.prisma.job.findMany({
      include: {
        customer: true,
        container: true,
        driver: true,
        vehicle: true,
        createdByUser: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async updateJob(id: number, updateJobDto: Partial<CreateJobDto>) {
    const updateData: Record<string, any> = { ...updateJobDto };

    // Convert date strings to Date objects if provided
    if (updateJobDto.scheduledPickup) {
      updateData['scheduledPickup'] = new Date(updateJobDto.scheduledPickup);
    }
    if (updateJobDto.scheduledDelivery) {
      updateData['scheduledDelivery'] = new Date(
        updateJobDto.scheduledDelivery,
      );
    }
    if (updateJobDto.actualPickup) {
      updateData['actualPickup'] = new Date(updateJobDto.actualPickup);
    }
    if (updateJobDto.actualDelivery) {
      updateData['actualDelivery'] = new Date(updateJobDto.actualDelivery);
    }

    return this.prisma.job.update({
      where: { id },
      data: updateData,
      include: {
        customer: true,
        container: true,
        driver: true,
        vehicle: true,
        createdByUser: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            email: true,
          },
        },
      },
    });
  }

  async deleteJob(id: number) {
    return this.prisma.job.delete({
      where: { id },
    });
  }

  async findJobsByStatus(status: JobStatus) {
    return this.prisma.job.findMany({
      where: { status },
      include: {
        customer: true,
        container: true,
        driver: true,
        vehicle: true,
        createdByUser: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findJobsByDriver(driverId: string) {
    return this.prisma.job.findMany({
      where: { driverId },
      include: {
        customer: true,
        container: true,
        driver: true,
        vehicle: true,
        createdByUser: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
