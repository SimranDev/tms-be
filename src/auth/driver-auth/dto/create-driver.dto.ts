import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsDateString,
} from 'class-validator';

export class CreateDriverDto {
  @IsString()
  @IsNotEmpty()
  firstname: string;

  @IsString()
  @IsNotEmpty()
  lastname: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsString()
  @IsNotEmpty()
  licenseNumber: string;

  @IsDateString()
  @IsNotEmpty()
  licenseExpiryDate: string;
}
