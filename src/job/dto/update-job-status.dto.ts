import { IsEnum, IsOptional, IsString, IsDateString } from 'class-validator';
import { JobStatus } from '@prisma/client';

export class UpdateJobStatusDto {
  @IsEnum(JobStatus)
  status: JobStatus;

  @IsOptional()
  @IsDateString()
  actualPickup?: string;

  @IsOptional()
  @IsDateString()
  actualDelivery?: string;

  @IsOptional()
  @IsString()
  instructions?: string;

  @IsOptional()
  @IsString()
  customerReference?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
