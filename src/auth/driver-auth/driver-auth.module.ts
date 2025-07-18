import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DriverAuthService } from './driver-auth.service';
import { DriverAuthController } from './driver-auth.controller';
import { DriverJwtStrategy } from './strategies/driver-jwt.strategy';
import { DriverLocalStrategy } from './strategies/driver-local.strategy';
import { PrismaModule } from '../../prisma/prisma.module';
import { UserAuthModule } from '../user-auth/user-auth.module';

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    UserAuthModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'your-secret-key',
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [DriverAuthController],
  providers: [DriverAuthService, DriverJwtStrategy, DriverLocalStrategy],
  exports: [DriverAuthService],
})
export class DriverAuthModule {}
