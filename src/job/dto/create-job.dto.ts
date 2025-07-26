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
  pickupLocationId: string; // Changed to location reference

  @IsString()
  @IsNotEmpty()
  deliveryLocationId: string; // Changed to location reference

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
  instructions?: string; // New field

  @IsString()
  @IsOptional()
  customerReference?: string; // New field

  @IsString()
  @IsOptional()
  notes?: string;
}
