import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from '../auth.service';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from 'src/address/entities/address.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
    private reflector: Reflector,
    private authService: AuthService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions: string[] = this.reflector.getAllAndOverride<
      string[]
    >(PERMISSIONS_KEY, [context.getClass(), context.getHandler()]);
    if (!requiredPermissions) return true;
    const request: Request = context.switchToHttp().getRequest();
    const user = request.user as User;
    if (!user) return false;
    const userId = user.id;
    const userPermissions = await this.authService.getUserPermissions(userId);
    const hasPermissions = requiredPermissions.every((p) =>
      userPermissions.includes(this.cleanOwn(p)),
    );
    if (!hasPermissions)
      throw new ForbiddenException(
        'You dont have permission for this operation',
      );
    for (const p of requiredPermissions) {
      if (p.endsWith(':own')) {
        const [resource] = p.split(':');
        const paramId = request.params['id'];
        const isOwner = await this.checkOwnership(resource, userId, +paramId);
        if (!isOwner) {
          throw new ForbiddenException("You don't have permissions");
        }
      }
    }
    return true;
  }

  private cleanOwn(str: string) {
    if (str.endsWith(':own')) {
      return str.slice(0, -4);
    }
    return str;
  }
  private async checkOwnership(
    resource: string,
    userId: number,
    resourceId: number,
  ) {
    if (resource === 'address') {
      const address = await this.addressRepository.findOne({
        where: { id: resourceId },
        relations: ['user'],
      });
      if (!address) return false;
      return address.user.id === userId;
    }
  }
}
