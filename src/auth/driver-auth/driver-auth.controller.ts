import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import { DriverAuthService } from './driver-auth.service';
import { DriverLoginDto } from './dto/driver-login.dto';
import { CreateDriverDto } from './dto/create-driver.dto';
import { DriverJwtAuthGuard } from './guards/driver-jwt-auth.guard';
import { UserJwtAuthGuard } from '../user-auth/guards/user-jwt-auth.guard';

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string;
  };
}

@Controller('driver-auth')
export class DriverAuthController {
  constructor(private readonly driverAuthService: DriverAuthService) {}

  @Post('login')
  async login(@Body() loginDto: DriverLoginDto) {
    return this.driverAuthService.login(loginDto);
  }

  @UseGuards(UserJwtAuthGuard)
  @Post('create')
  async createDriver(@Body() createDriverDto: CreateDriverDto) {
    return this.driverAuthService.createDriver(createDriverDto);
  }

  @UseGuards(DriverJwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req: AuthenticatedRequest) {
    return this.driverAuthService.getProfile(req.user.id);
  }
}
