import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { Response } from 'express';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  async create(@Body() createTicketDto: CreateTicketDto, @Res() res: Response) {
    const newTicket = await this.ticketsService.create(createTicketDto);
    return res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      data: newTicket,
      message: 'Ticket created',
    });
  }

  @Get()
  async findAll(@Res() res: Response) {
    const tickets = await this.ticketsService.findAll();
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: tickets,
      message: 'Tickets found',
    });
  }

  @Get(':id')
  async findOne(@Res() res: Response, @Param('id') id: string) {
    const ticket = await this.ticketsService.findOne(+id);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: ticket,
      message: 'Ticket found',
    });
  }
}
