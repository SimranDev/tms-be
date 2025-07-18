import { JobStatus } from '@prisma/client';
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsDateString,
} from 'class-validator';

export class CreateJobDto {
  @IsString()
  @IsNotEmpty()
  customerId: string;

  @IsString()
  @IsNotEmpty()
  containerId: string;

  @IsString()
  @IsNotEmpty()
  driverId: string;

  @IsString()
  @IsNotEmpty()
  vehicleId: string;

  @IsEnum(JobStatus)
  status: JobStatus;

  @IsString()
  @IsNotEmpty()
  pickupAddress: string;

  @IsString()
  @IsNotEmpty()
  deliveryAddress: string;

  @IsDateString()
  scheduledPickup: string;

  @IsDateString()
  scheduledDelivery: string;

  @IsDateString()
  @IsOptional()
  actualPickup?: string;

  @IsDateString()
  @IsOptional()
  actualDelivery?: string;

  @IsString()
  @IsNotEmpty()
  freightDescription: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsNotEmpty()
  createdByUserId: string;
}
