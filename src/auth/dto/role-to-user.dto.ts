import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class RoleToUserDto {
  @ApiProperty({ example: '1' })
  @IsNumber()
  user_id: number;
  @ApiProperty({ example: '2' })
  @IsNumber()
  role_id: number;
}
