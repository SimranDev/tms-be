import { JobStatus } from '@prisma/client';
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsDateString,
  IsNumber,
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

  @IsNumber()
  pickupLatitude: number;

  @IsNumber()
  pickupLongitude: number;

  @IsString()
  @IsNotEmpty()
  deliveryAddress: string;

  @IsNumber()
  deliveryLatitude: number;

  @IsNumber()
  deliveryLongitude: number;

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
}
