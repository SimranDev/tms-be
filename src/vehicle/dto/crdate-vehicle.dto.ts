import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsInt,
  IsPositive,
  IsDateString,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import { VehicleType } from '@prisma/client';

export class CreateVehicleDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  rego: string;

  @IsString()
  @IsNotEmpty()
  vinNumber: string;

  @IsEnum(VehicleType)
  type: VehicleType;

  @IsInt()
  @IsPositive()
  capacityKg: number;

  @IsDateString()
  registrationExpiry: string;

  @IsDateString()
  insuranceExpiry: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
