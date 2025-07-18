import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
  HttpCode,
} from '@nestjs/common';
import { UserAuthService } from './user-auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UserJwtAuthGuard } from './guards/user-jwt-auth.guard';

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string;
  };
}

@Controller('user-auth')
export class UserAuthController {
  constructor(private readonly userAuthService: UserAuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.userAuthService.register(registerDto);
  }

  @UseGuards(UserJwtAuthGuard)
  @Post('create')
  async createUser(@Body() registerDto: RegisterDto) {
    return this.userAuthService.register(registerDto);
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() loginDto: LoginDto) {
    return this.userAuthService.login(loginDto);
  }

  @UseGuards(UserJwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req: AuthenticatedRequest) {
    return this.userAuthService.getProfile(req.user.id);
  }
}
