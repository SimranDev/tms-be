import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JobService } from './job.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UserJwtAuthGuard } from '../auth/user-auth/guards/user-jwt-auth.guard';
import { JobStatus } from 'generated/prisma';

@Controller('jobs')
@UseGuards(UserJwtAuthGuard)
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Post()
  async createJob(@Body() createJobDto: CreateJobDto) {
    return this.jobService.createJob(createJobDto);
  }

  @Get(':id')
  async findJobById(@Param('id') id: string) {
    return this.jobService.findJobById(id);
  }

  @Get()
  async findAllJobs(
    @Query('status') status?: JobStatus,
    @Query('driverId') driverId?: string,
  ) {
    if (status) {
      return this.jobService.findJobsByStatus(status);
    }
    if (driverId) {
      return this.jobService.findJobsByDriver(driverId);
    }
    return this.jobService.findAllJobs();
  }

  @Put(':id')
  async updateJob(
    @Param('id') id: string,
    @Body() updateJobDto: Partial<CreateJobDto>,
  ) {
    return this.jobService.updateJob(id, updateJobDto);
  }

  @Delete(':id')
  async deleteJob(@Param('id') id: string) {
    return this.jobService.deleteJob(id);
  }
}
