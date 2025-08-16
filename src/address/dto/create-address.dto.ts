import { IsString, IsNotEmpty, Length, IsOptional } from 'class-validator';

export class CreateAddressDto {
  @IsNotEmpty({ message: 'UserId is required' })
  userId: number;

  @IsString({ message: 'Province must be string' })
  @IsNotEmpty({ message: 'Province is required' })
  province: string;

  @IsString({ message: 'City must be string' })
  @IsNotEmpty({ message: 'City is required' })
  city: string;

  @IsString({ message: 'Address must be string' })
  @IsNotEmpty({ message: 'Address is required' })
  address: string;

  @IsString({ message: 'Postal Code must be string' })
  @Length(10, 10, { message: 'Postal Code should be 10 characters' })
  postal_code: string;

  @IsString({ message: 'Receiver Phone Number must be string' })
  @Length(11, 11, { message: 'Phone Number should be 11 characters' })
  receiver_mobile: string;

  @IsOptional()
  @IsString({ message: 'Description must be string' })
  description: string;
}
