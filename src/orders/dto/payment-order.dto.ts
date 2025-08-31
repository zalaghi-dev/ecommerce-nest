import { IsNotEmpty, IsNumber } from 'class-validator';

export class PaymentOrderDto {
  @IsNumber()
  @IsNotEmpty()
  order_id: number;
}
