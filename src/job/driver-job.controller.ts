import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { JobService } from './job.service';
import { UpdateJobStatusDto } from './dto/update-job-status.dto';
import { DriverJwtAuthGuard } from '../auth/driver-auth/guards/driver-jwt-auth.guard';
import { GetUser, RequestUser } from '../auth/decorators/get-user.decorator';

@Controller('driver/jobs')
@UseGuards(DriverJwtAuthGuard)
export class DriverJobController {
  constructor(private readonly jobService: JobService) {}

  @Get('my-jobs')
  async getMyJobs(@GetUser() driver: RequestUser) {
    return this.jobService.findJobsByDriver(driver.id);
  }

  @Get(':id')
  async getJobById(@Param('id') id: number, @GetUser() driver: RequestUser) {
    return await this.jobService.findDriverJobById(id, driver.id);
  }

  @Patch(':id/status')
  async updateJobStatus(
    @Param('id') id: number,
    @Body() updateJobStatusDto: UpdateJobStatusDto,
    @GetUser() driver: RequestUser,
  ) {
    return await this.jobService.updateJobStatus(
      id,
      driver.id,
      updateJobStatusDto,
    );
  }
}
