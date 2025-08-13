import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  Length,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @IsString({ message: 'phone number must be string' })
  @Length(11, 11, { message: 'phone number must be 11 characters' })
  @IsNotEmpty({ message: 'phone cant  be empty' })
  @Matches(/^09\d{9}$/, {
    message: 'phone number must start with 09 and be 11 digits',
  })
  @Transform(({ value }: { value: string }) => value?.trim() ?? '')
  mobile: string;

  @IsString({ message: 'password should be string' })
  @MinLength(8, { message: 'Password should be at least 8 characters' })
  // @MaxLength(16, { message: 'Password should be at most 16 characters' })
  password: string;
}
