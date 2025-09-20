import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class PermissionToRole {
  @ApiProperty({ example: '1' })
  @IsNumber()
  permission_id: number;
  @ApiProperty({ example: '2' })
  @IsNumber()
  role_id: number;
}
