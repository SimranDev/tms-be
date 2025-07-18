import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { Driver } from 'generated/prisma';
import { DriverLoginDto } from './dto/driver-login.dto';
import { CreateDriverDto } from './dto/create-driver.dto';
import * as bcrypt from 'bcrypt';

export interface JwtPayload {
  sub: string;
  email: string;
  type: 'user' | 'driver';
}

export interface DriverAuthResponse {
  driver: Omit<Driver, 'password'>;
  access_token: string;
}

@Injectable()
export class DriverAuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async create(
    createDriverDto: CreateDriverDto,
  ): Promise<Omit<Driver, 'password'>> {
    const hashedPassword = await bcrypt.hash(createDriverDto.password, 10);

    const driver = await this.prisma.driver.create({
      data: {
        firstname: createDriverDto.firstname,
        lastname: createDriverDto.lastname,
        email: createDriverDto.email,
        phoneNumber: createDriverDto.phoneNumber,
        password: hashedPassword,
        licenseNumber: createDriverDto.licenseNumber,
        licenseExpiryDate: new Date(createDriverDto.licenseExpiryDate),
      },
      select: {
        id: true,
        firstname: true,
        lastname: true,
        email: true,
        phoneNumber: true,
        licenseNumber: true,
        licenseExpiryDate: true,
        isActive: true,
        createdAt: true,
      },
    });

    return driver;
  }

  async findByEmail(email: string): Promise<Driver | null> {
    return this.prisma.driver.findUnique({
      where: { email },
    });
  }

  async findById(id: string): Promise<Omit<Driver, 'password'> | null> {
    return this.prisma.driver.findUnique({
      where: { id },
      select: {
        id: true,
        firstname: true,
        lastname: true,
        email: true,
        phoneNumber: true,
        licenseNumber: true,
        licenseExpiryDate: true,
        isActive: true,
        createdAt: true,
      },
    });
  }

  async validatePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  async validateDriver(
    email: string,
    password: string,
  ): Promise<Omit<Driver, 'password'> | null> {
    const driver = await this.findByEmail(email);
    if (!driver) {
      return null;
    }

    const isPasswordValid = await this.validatePassword(
      password,
      driver.password,
    );
    if (!isPasswordValid) {
      return null;
    }

    const { password: _, ...result } = driver;
    return result;
  }

  async login(loginDto: DriverLoginDto): Promise<DriverAuthResponse> {
    const driver = await this.validateDriver(loginDto.email, loginDto.password);
    if (!driver) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = {
      sub: driver.id,
      email: driver.email,
      type: 'driver',
    };
    const access_token = this.jwtService.sign(payload);

    return {
      driver,
      access_token,
    };
  }

  async createDriver(
    createDriverDto: CreateDriverDto,
  ): Promise<Omit<Driver, 'password'>> {
    // Check if driver already exists
    const existingDriver = await this.findByEmail(createDriverDto.email);
    if (existingDriver) {
      throw new UnauthorizedException('Driver with this email already exists');
    }

    return this.create(createDriverDto);
  }

  async getProfile(driverId: string): Promise<Omit<Driver, 'password'> | null> {
    return this.findById(driverId);
  }
}
