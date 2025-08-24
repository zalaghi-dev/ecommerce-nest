import { IsArray, IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsInt()
  price: number;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsInt()
  stock: number;

  @IsOptional()
  @IsArray()
  categoryIds?: number;
}
