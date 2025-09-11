import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLES_KEY } from '../decorators/roles.decorator';
import Role from 'src/users/enums/Role';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles: string[] = this.reflector.getAllAndOverride<Role[]>(
      ROLES_KEY,
      [context.getClass(), context.getHandler()],
    );
    if (!requiredRoles) return true;
    const { user } = context.switchToHttp().getRequest();
    const hasRole = requiredRoles.includes(user.role);
    if (!hasRole) throw new ForbiddenException("You don't have permission.");
    return true;
  }
}
