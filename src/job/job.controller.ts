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
import { JobStatus } from '@prisma/client';
import { GetUser, RequestUser } from '../auth/decorators/get-user.decorator';

@Controller('jobs')
@UseGuards(UserJwtAuthGuard)
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Post()
  async createJob(
    @Body() createJobDto: CreateJobDto,
    @GetUser() user: RequestUser,
  ) {
    return this.jobService.createJob(createJobDto, user.id);
  }

  @Get(':id')
  async findJobById(@Param('id') id: number) {
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
    @Param('id') id: number,
    @Body() updateJobDto: Partial<CreateJobDto>,
  ) {
    return this.jobService.updateJob(id, updateJobDto);
  }

  @Delete(':id')
  async deleteJob(@Param('id') id: number) {
    return this.jobService.deleteJob(id);
  }
}
