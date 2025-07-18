import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { User } from 'generated/prisma';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(registerDto: RegisterDto): Promise<Omit<User, 'password'>> {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const user = await this.databaseService.user.create({
      data: {
        firstname: registerDto.firstname,
        lastname: registerDto.lastname,
        email: registerDto.email,
        password: hashedPassword,
      },
      select: {
        id: true,
        firstname: true,
        lastname: true,
        email: true,
        createdAt: true,
      },
    });

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.databaseService.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string): Promise<Omit<User, 'password'> | null> {
    return this.databaseService.user.findUnique({
      where: { id },
      select: {
        id: true,
        firstname: true,
        lastname: true,
        email: true,
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
}
