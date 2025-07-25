import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class DriverLocalAuthGuard extends AuthGuard('driver-local') {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // You can add additional logic here if needed
    return super.canActivate(context);
  }
}
