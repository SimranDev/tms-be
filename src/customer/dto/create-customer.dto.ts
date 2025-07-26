import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class CreateCustomerDto {
  @IsString()
  @IsNotEmpty()
  companyName: string;

  @IsString()
  @IsNotEmpty()
  contactPerson: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  addressId: string; // Changed from address to addressId (Location reference)
}
