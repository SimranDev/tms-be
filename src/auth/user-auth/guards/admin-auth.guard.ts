import {
  Injectable,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { UserJwtAuthGuard } from './user-jwt-auth.guard';

interface AuthenticatedUser {
  id: string;
  email: string;
  type: 'user' | 'driver';
}

interface RequestWithUser {
  user: AuthenticatedUser;
}

@Injectable()
export class AdminAuthGuard extends UserJwtAuthGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // First check if user is authenticated
    const isAuthenticated = await super.canActivate(context);

    if (!isAuthenticated) {
      return false;
    }

    // Get the request object
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;

    // Check if user type is 'user' (admin)
    if (!user || user.type !== 'user') {
      throw new ForbiddenException('Access denied. Admin privileges required.');
    }

    return true;
  }
}
