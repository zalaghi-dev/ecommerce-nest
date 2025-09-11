import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';
import { Permission } from '../entities/permission.entity';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private authService: AuthService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions: string[] = this.reflector.getAllAndOverride<
      string[]
    >(PERMISSIONS_KEY, [context.getClass(), context.getHandler()]);
    if (!requiredPermissions) return true;
    const { user } = context.switchToHttp().getRequest();

    const userId = user.id as number;
    const userPermissions = await this.authService.getUserPermissions(userId);
    const hasPermissions = requiredPermissions.every((p) =>
      userPermissions.includes(p),
    );
    if (!hasPermissions)
      throw new ForbiddenException(
        'You dont have permission for this operation',
      );
    return true;
  }
}
