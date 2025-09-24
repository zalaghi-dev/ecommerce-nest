import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from 'src/auth/entities/permission.entity';
import { Role } from 'src/auth/entities/role.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class SeederService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Role>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}
  async onApplicationBootstrap() {
    await this.seedPermissionAndRole();
  }

  async seedPermissionAndRole() {
    const permissionData = [
      // User
      'user:create',
      'user:read',
      'user:edit',
      'user:delete',
      // Address
      'address:create',
      'address:read',
      'address:edit',
      'address:delete',
    ];

    const rolesData = [
      { name: 'admin', permissions: permissionData },
      { name: 'manager', permissions: [] },
      { name: 'user', permissions: [] },
    ];

    for (const p of permissionData) {
      const permission = await this.permissionRepository.findOne({
        where: { name: p },
      });
      if (!permission) {
        const newPerm = this.permissionRepository.create({ name: p });
        await this.permissionRepository.save(newPerm);
      }
    }
    for (const { name, permissions } of rolesData) {
      const role = await this.roleRepository.findOne({
        where: { name },
      });
      const permissions_data = await this.permissionRepository.findBy({
        name: In(permissions),
      });
      if (!role) {
        const newRole = this.roleRepository.create({
          name,
          permissions: permissions_data,
        });
        await this.roleRepository.save(newRole);
      } else {
        role.permissions = permissions_data;
        await this.roleRepository.save(role);
      }
    }
  }
}
