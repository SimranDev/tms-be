import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserAuthService } from '../user-auth.service';

export interface JwtPayload {
  sub: string;
  email: string;
  type: 'user' | 'driver';
}

@Injectable()
export class UserJwtStrategy extends PassportStrategy(Strategy, 'user-jwt') {
  constructor(
    configService: ConfigService,
    private readonly userAuthService: UserAuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'your-secret-key',
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.userAuthService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException();
    }
    return { ...user, type: 'user' };
  }
}
