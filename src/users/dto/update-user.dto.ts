import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import UserRoleEnum from '../enums/userRoleEnum';
export class UpdateUserDto {
  @IsString({ message: 'name must be string' })
  @IsNotEmpty({ message: "phone can't  be empty" })
  display_name: string;

  @IsEnum(UserRoleEnum, { message: 'user role should be (admin,user)' })
  @IsOptional()
  role: UserRoleEnum;
}
