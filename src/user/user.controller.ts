import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UserJwtAuthGuard } from '../auth/user-auth/guards/user-jwt-auth.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(UserJwtAuthGuard)
  getUsers() {
    return this.userService.findAll();
  }
}
