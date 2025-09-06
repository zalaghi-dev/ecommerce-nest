import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import { ApiExcludeController } from '@nestjs/swagger';
@ApiExcludeController()
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
}
