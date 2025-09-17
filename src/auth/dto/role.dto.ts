import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RoleDto {
  @ApiProperty({ example: 'admin' })
  @IsString()
  name: string;
}
