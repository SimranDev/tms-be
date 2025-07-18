import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { DriverAuthService } from '../driver-auth.service';

@Injectable()
export class DriverLocalStrategy extends PassportStrategy(
  Strategy,
  'driver-local',
) {
  constructor(private readonly driverAuthService: DriverAuthService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string) {
    const driver = await this.driverAuthService.validateDriver(email, password);
    if (!driver) {
      throw new UnauthorizedException();
    }
    return driver;
  }
}
