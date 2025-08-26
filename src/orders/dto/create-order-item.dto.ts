import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateOrderItemDto {
  @IsNumber()
  @IsNotEmpty()
  productId: number;

  //   @IsNumber()
  //   @IsNotEmpty()
  //   quantity: number;
}
