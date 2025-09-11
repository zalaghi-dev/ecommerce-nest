import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import Role from '../enums/Role';
export class UpdateUserDto {
  @IsString({ message: 'name must be string' })
  @IsNotEmpty({ message: "phone can't  be empty" })
  display_name: string;

  @IsEnum(Role, { message: 'user role should be (admin,user)' })
  @IsOptional()
  role: Role;
}
