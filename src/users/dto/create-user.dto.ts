import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import Role from '../enums/Role';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
export class CreateUserDto {
  @ApiProperty({ example: '09120000000', description: 'Phone Number' })
  @IsString({ message: 'phone number must be string' })
  @Length(11, 11, { message: 'phone number must be 11 characters' })
  @IsNotEmpty({ message: 'phone cant  be empty' })
  @Matches(/^09\d{9}$/, {
    message: 'phone number must start with 09 and be 11 digits',
  })
  @Transform(({ value }: { value: string }) => value?.trim() ?? '')
  mobile: string;

  @ApiProperty({
    example: 'Amir Zalaghi',
    description: 'Display name for show',
  })
  @IsString({ message: 'name must be string' })
  @IsNotEmpty({ message: "phone can't  be empty" })
  display_name: string;

  @ApiPropertyOptional({
    example: '1234',
    description: 'User Password',
  })
  @IsString({ message: 'password should be string' })
  @IsOptional()
  @MinLength(8, { message: 'Password should be at least 8 characters' })
  @MaxLength(16, { message: 'Password should be at most 16 characters' })
  password: string;

  @ApiPropertyOptional({
    example: Role.Admin,
    enum: Role,
  })
  @IsEnum(Role, { message: 'user role should be (admin,user)' })
  @IsOptional()
  role: Role;
}
