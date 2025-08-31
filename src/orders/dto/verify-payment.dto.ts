import { IsNotEmpty, IsNumber } from 'class-validator';

export class VerifyPaymentDto {
  @IsNumber()
  @IsNotEmpty({ message: 'TrackId is required' })
  trackId: number;
}
