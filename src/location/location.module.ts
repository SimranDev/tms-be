import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LocationGateway } from './location.gateway';
import { LocationService } from './location.service';
import { LocationController } from './location.controller';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'your-secret-key',
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [LocationGateway, LocationService],
  controllers: [LocationController],
  exports: [LocationService, LocationGateway],
})
export class LocationModule {}
