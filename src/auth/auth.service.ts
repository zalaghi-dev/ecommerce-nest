import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import UserRoleEnum from 'src/users/enums/userRoleEnum';
import { UsersService } from 'src/users/users.service';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    // private readonly jwtService: JwtService,
  ) {}

  async register(mobile: string, password: string, display_name: string) {
    const hashedPassword: string = await bcrypt.hash(password, 12);
    return this.userService.create({
      mobile,
      display_name,
      password: hashedPassword,
      role: UserRoleEnum.NormalUser,
    });
  }
  async login(mobile: string, password: string) {
    const user = await this.userService.findOneByMobile(mobile);
    if (!(await bcrypt.compare(password, user.password)))
      throw new UnauthorizedException('Incorrect Password');
    const payload = {
      mobile: user.mobile,
      sub: user.id,
      display_name: user.display_name,
    };
  }
}
