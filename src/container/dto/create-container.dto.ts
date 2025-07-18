import { ContainerType, ContainerSize, ContainerStatus } from '@prisma/client';
import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';

export class CreateContainerDto {
  @IsString()
  @IsNotEmpty()
  containerNumber: string;

  @IsEnum(ContainerType)
  type: ContainerType;

  @IsEnum(ContainerSize)
  size: ContainerSize;

  @IsEnum(ContainerStatus)
  status: ContainerStatus;

  @IsString()
  @IsOptional()
  notes?: string;
}
