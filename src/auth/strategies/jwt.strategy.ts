import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import Role from 'src/users/enums/Role';
interface JwtPayload {
  sub: string;
  mobile: string;
  display_name: string;
  role: Role;
  iat?: number;
  exp?: number;
}
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly configService: ConfigService) {
    const secret = configService.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error('JWT_SECRET is not defined');
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: secret,
    });
  }
  validate(payload: JwtPayload) {
    return {
      userId: payload.sub,
      mobile: payload.mobile,
      role: payload.role,
      display_name: payload.display_name,
    };
  }
}
