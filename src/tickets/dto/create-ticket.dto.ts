import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTicketDto {
  @IsNotEmpty({ message: 'UserId is required' })
  userId: number;

  @IsNotEmpty({ message: 'Title is Required' })
  @IsString({ message: 'Title must be string' })
  title: string;

  @IsNotEmpty({ message: 'Subject is Required' })
  @IsString({ message: 'Subject must be string' })
  subject: string;

  @IsNotEmpty({ message: 'Description is Required' })
  @IsString({ message: 'Description must be string' })
  description: string;

  @IsOptional()
  replyTo: string;
}
