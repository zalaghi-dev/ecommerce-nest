import { IsNotEmpty, IsNumber } from 'class-validator';

export class VerifyPaymentDto {
  @IsNumber()
  @IsNotEmpty({ message: 'TrackId is required' })
  track_id: number;

  @IsNumber()
  @IsNotEmpty()
  order_id: number;
}
