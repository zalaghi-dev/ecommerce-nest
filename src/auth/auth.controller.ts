import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import { Public } from './decorators/public.decorator';
import { RoleDto } from './dto/role.dto';
import { RoleToUserDto } from './dto/role-to-user.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { PermissionDto } from './dto/permission.dto';
import { PermissionToRole } from './dto/permission-to-role.dto';
import { PermissionToUser } from './dto/permission-to-user.dto';
import { LoggingInterceptor } from 'src/interceptors/logging.interceptor';

@Public()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    const { display_name, mobile, password } = registerDto;
    const register = await this.authService.register(
      mobile,
      password,
      display_name,
    );
    return register;
  }
  @UseInterceptors(LoggingInterceptor)
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const { mobile, password } = loginDto;
    const login = await this.authService.login(mobile, password);
    return login;
  }
  @ApiBearerAuth()
  @Post('role')
  async newRole(@Body() createRole: RoleDto) {
    const role = await this.authService.createRole(createRole.name);
    return role;
  }
  @ApiBearerAuth()
  @Post('role/append-to-user')
  async addRoleToUser(@Body() roleToUserDto: RoleToUserDto) {
    const userRole = await this.authService.addRoleToUser(
      roleToUserDto.user_id,
      roleToUserDto.role_id,
    );
    return userRole;
  }
  @ApiBearerAuth()
  @Post('role/remove-from-user')
  async removeRoleFromUser(@Body() roleToUserDto: RoleToUserDto) {
    const userRole = await this.authService.removeRoleFromUser(
      roleToUserDto.user_id,
      roleToUserDto.role_id,
    );
    return userRole;
  }
  @ApiBearerAuth()
  @Post('roles/get-user-roles/:user_id')
  async getUserRoles(@Param('user_id') user_id: string) {
    const roles = await this.authService.getUserRoles(+user_id);
    return roles;
  }

  @ApiBearerAuth()
  @Get('get-user-permissions/:user_id')
  async getUserPermission(@Param('user_id') user_id: string) {
    const permissions = await this.authService.getUserPermissions(+user_id);
    return permissions;
  }

  // ================= Permission
  @ApiBearerAuth()
  @Post('permission')
  async newPermission(@Body() createPermission: PermissionDto) {
    if (Array.isArray(createPermission.name)) {
      const created: string[] = [];
      await Promise.all(
        createPermission.name.map(async (p) => {
          await this.authService.createPermission(p);
          created.push(p);
        }),
      );
      return created;
    } else {
      const permission = await this.authService.createPermission(
        createPermission.name,
      );
      return permission;
    }
  }
  @ApiBearerAuth()
  @Post('permission/append-to-role')
  async addPermissionToRole(@Body() permissionToRole: PermissionToRole) {
    const permissionRole = await this.authService.addPermissionToRole(
      permissionToRole.permission_id,
      permissionToRole.role_id,
    );
    return permissionRole;
  }

  @ApiBearerAuth()
  @Post('permission/append-to-user')
  async addPermissionToUser(@Body() permissionToUserDto: PermissionToUser) {
    const userRole = await this.authService.addPermissionToUser(
      permissionToUserDto.user_id,
      permissionToUserDto.permission_id,
    );
    return userRole;
  }
  @ApiBearerAuth()
  @Post('roles/get-user-permissions/:user_id')
  async getUserPermissions(@Param('user_id') user_id: string) {
    const permissions = await this.authService.getUserPermissions(+user_id);
    return permissions;
  }
}
