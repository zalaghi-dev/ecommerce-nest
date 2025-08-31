import { IsNotEmpty, IsNumber } from 'class-validator';

export class PaymentOrderDto {
  @IsNumber()
  @IsNotEmpty({ message: 'I need amount!' })
  amount: number;
}
