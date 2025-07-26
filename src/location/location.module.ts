import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LocationGateway } from './location.gateway';
import { LocationService } from './location.service';
import { LocationController } from './location.controller';
import { LocationManagementService } from './location-management.service';
import { LocationManagementController } from './location-management.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'your-secret-key',
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [LocationGateway, LocationService, LocationManagementService],
  controllers: [LocationController, LocationManagementController],
  exports: [LocationService, LocationGateway, LocationManagementService],
})
export class LocationModule {}
