import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { DriverModule } from './driver/driver.module';
import { AuthModule } from './auth/auth.module';
import { VehicleModule } from './vehicle/vehicle.module';
import { ContainerModule } from './container/container.module';
import { JobModule } from './job/job.module';
import { CustomerModule } from './customer/customer.module';
import { LocationModule } from './location/location.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UserModule,
    CustomerModule,
    DriverModule,
    VehicleModule,
    ContainerModule,
    JobModule,
    LocationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
