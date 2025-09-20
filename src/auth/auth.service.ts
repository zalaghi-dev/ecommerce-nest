import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async register(mobile: string, password: string, display_name: string) {
    const hashedPassword: string = await bcrypt.hash(password, 12);
    return this.userService.create({
      mobile,
      display_name,
      password: hashedPassword,
    });
  }

  async login(mobile: string, password: string) {
    const user = await this.userService.findOneByMobile(mobile);
    if (!user || !(await bcrypt.compare(password, user.password)))
      throw new UnauthorizedException('Incorrect Password');
    const payload = {
      mobile: user.mobile,
      sub: user.id,
      display_name: user.display_name,
      role: user.role,
    };
    const token = this.jwtService.sign(payload);
    return { accessToken: token };
  }
  async getUserPermissions(user_id: number) {
    const user = await this.userService.findUserByPermission(user_id);
    const permissions = new Set<string>();
    user.roles?.forEach((role) =>
      role.permissions?.forEach((p) => permissions.add(p.name)),
    );
    user?.permissions?.forEach((p) => permissions.add(p.name));
    return Array.from(permissions);
  }

  async createRole(name: string) {
    const role = this.roleRepository.create({ name });
    return await this.roleRepository.save(role);
  }

  async addRoleToUser(userId: number, roleId: number) {
    const user = await this.userService.findUserByPermission(userId);
    const role = await this.roleRepository.findOne({ where: { id: roleId } });
    if (!role) throw new NotFoundException('user role not found');
    if (!user.roles.find((r) => r.id === role.id)) {
      return await this.userService.addRole(userId, role);
    }
    throw new BadRequestException('invalid data');
  }
  async removeRoleFromUser(userId: number, roleId: number) {
    const user = await this.userService.findUserByPermission(userId);
    const role = await this.roleRepository.findOne({ where: { id: roleId } });
    if (!role) throw new NotFoundException('user role not found');
    if (user.roles.find((r) => r.id === role.id)) {
      return await this.userService.removeRole(userId, roleId);
    }
    throw new BadRequestException('invalid data');
  }

  async getUserRoles(userId: number) {
    const user = await this.userService.findUserByPermission(userId);
    return user.roles;
  }
}
