import { IsInt, IsNotEmpty, IsNumber } from 'class-validator';

export class BookmarkProductDto {
  @IsNotEmpty()
  @IsNumber()
  @IsInt()
  product_id: number;

  @IsNotEmpty()
  @IsNumber()
  @IsInt()
  user_id: number;
}
