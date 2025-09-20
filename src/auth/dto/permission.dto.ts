import { ApiProperty } from '@nestjs/swagger';

export class PermissionDto {
  @ApiProperty({ example: 'create' })
  name: string | string[];
}
