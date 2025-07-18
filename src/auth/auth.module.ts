import { Module } from '@nestjs/common';
import { UserAuthModule } from './user-auth/user-auth.module';
import { DriverAuthModule } from './driver-auth/driver-auth.module';

@Module({
  imports: [UserAuthModule, DriverAuthModule],
  exports: [UserAuthModule, DriverAuthModule],
})
export class AuthModule {}
