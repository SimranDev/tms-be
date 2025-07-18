import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { DriverAuthService } from '../driver-auth.service';

export interface JwtPayload {
  sub: string;
  email: string;
  type: 'user' | 'driver';
}

@Injectable()
export class DriverJwtStrategy extends PassportStrategy(
  Strategy,
  'driver-jwt',
) {
  constructor(
    configService: ConfigService,
    private readonly driverAuthService: DriverAuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'your-secret-key',
    });
  }

  async validate(payload: JwtPayload) {
    const driver = await this.driverAuthService.findById(payload.sub);
    if (!driver) {
      throw new UnauthorizedException();
    }
    return { ...driver, type: 'driver' };
  }
}
