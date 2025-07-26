import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCustomerLocationDto {
  @IsString()
  @IsNotEmpty()
  customerId: string;

  @IsString()
  @IsNotEmpty()
  locationId: string;
}
