import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
  MinLength,
} from 'class-validator';
import UserRoleEnum from '../enums/userRoleEnum';
export class CreateUserDto {
  @IsString({ message: 'phone number must be string' })
  @Length(11, 11, { message: 'phone number must be 11 characters' })
  @IsNotEmpty({ message: 'phone cant  be empty' })
  @Matches(/^09\d{9}$/, {
    message: 'phone number must start with 09 and be 11 digits',
  })
  @Transform(({ value }: { value: string }) => value?.trim() ?? '')
  mobile: string;

  @IsString({ message: 'name must be string' })
  @IsNotEmpty({ message: "phone can't  be empty" })
  display_name: string;

  @IsString({ message: 'password should be string' })
  @IsOptional()
  @MinLength(8, { message: 'Password should be at least 8 characters' })
  password: string;

  @IsEnum(UserRoleEnum, { message: 'user role should be (admin,user)' })
  @IsOptional()
  role: UserRoleEnum;
}
