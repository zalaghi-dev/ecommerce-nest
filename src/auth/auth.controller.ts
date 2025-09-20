import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
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

@Public()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto, @Res() res: Response) {
    const { display_name, mobile, password } = registerDto;
    const register = await this.authService.register(
      mobile,
      password,
      display_name,
    );
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: register,
      message: 'Signed Up Successfully',
    });
  }
  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const { mobile, password } = loginDto;
    const login = await this.authService.login(mobile, password);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: login,
      message: 'Logged In Successfully',
    });
  }
  @ApiBearerAuth()
  @Post('role')
  async newRole(@Body() createRole: RoleDto, @Res() res: Response) {
    const role = await this.authService.createRole(createRole.name);
    return res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      data: role,
      message: 'Role created successfully',
    });
  }
  @ApiBearerAuth()
  @Post('role/append-to-user')
  async addRoleToUser(
    @Body() roleToUserDto: RoleToUserDto,
    @Res() res: Response,
  ) {
    const userRole = await this.authService.addRoleToUser(
      roleToUserDto.user_id,
      roleToUserDto.role_id,
    );
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: userRole,
      message: 'Role added for user successfully',
    });
  }
  @ApiBearerAuth()
  @Post('role/remove-from-user')
  async removeRoleFromUser(
    @Body() roleToUserDto: RoleToUserDto,
    @Res() res: Response,
  ) {
    const userRole = await this.authService.removeRoleFromUser(
      roleToUserDto.user_id,
      roleToUserDto.role_id,
    );
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: userRole,
      message: 'Role removed from user successfully',
    });
  }
  @ApiBearerAuth()
  @Post('roles/get-user-roles/:user_id')
  async getUserRoles(@Param('user_id') user_id: string, @Res() res: Response) {
    const roles = await this.authService.getUserRoles(+user_id);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: roles,
      message: 'Roles found!',
    });
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
  async newPermission(
    @Body() createPermission: PermissionDto,
    @Res() res: Response,
  ) {
    if (Array.isArray(createPermission.name)) {
      const created: string[] = [];
      await Promise.all(
        createPermission.name.map(async (p) => {
          await this.authService.createPermission(p);
          created.push(p);
        }),
      );
      return res.status(HttpStatus.CREATED).json({
        statusCode: HttpStatus.CREATED,
        data: created,
        message: 'Permissions created successfully',
      });
    } else {
      const permission = await this.authService.createPermission(
        createPermission.name,
      );
      return res.status(HttpStatus.CREATED).json({
        statusCode: HttpStatus.CREATED,
        data: permission,
        message: 'Permission created successfully',
      });
    }
  }
  @ApiBearerAuth()
  @Post('permission/append-to-role')
  async addPermissionToRole(
    @Body() permissionToRole: PermissionToRole,
    @Res() res: Response,
  ) {
    const permissionRole = await this.authService.addPermissionToRole(
      permissionToRole.permission_id,
      permissionToRole.role_id,
    );
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: permissionRole,
      message: 'Permission added for role successfully',
    });
  }

  @ApiBearerAuth()
  @Post('permission/append-to-user')
  async addPermissionToUser(
    @Body() permissionToUserDto: PermissionToUser,
    @Res() res: Response,
  ) {
    const userRole = await this.authService.addPermissionToUser(
      permissionToUserDto.user_id,
      permissionToUserDto.permission_id,
    );
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: userRole,
      message: 'Permission added to user successfully',
    });
  }
  @ApiBearerAuth()
  @Post('roles/get-user-permissions/:user_id')
  async getUserPermissions(
    @Param('user_id') user_id: string,
    @Res() res: Response,
  ) {
    const permissions = await this.authService.getUserPermissions(+user_id);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: permissions,
      message: 'Permissions found!',
    });
  }
}
