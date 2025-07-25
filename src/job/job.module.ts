import { Module } from '@nestjs/common';
import { JobService } from './job.service';
import { JobController } from './job.controller';
import { DriverJobController } from './driver-job.controller';

@Module({
  controllers: [JobController, DriverJobController],
  providers: [JobService],
})
export class JobModule {}
