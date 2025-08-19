import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from './entities/ticket.entity';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    private readonly userService: UsersService,
  ) {}

  async create(createTicketDto: CreateTicketDto) {
    const { userId, replyTo, ...ticketData } = createTicketDto;
    const user = await this.userService.findOne(userId);
    let replyToTicket: Ticket | null = null;
    if (replyTo) {
      replyToTicket = await this.ticketRepository.findOneOrFail({
        where: {
          id: +replyTo,
        },
        relations: ['replyTo'],
      });
      if (replyToTicket.replyTo)
        throw new BadRequestException("You can't reply on this ticket");
    }
    const ticket = this.ticketRepository.create({
      user,
      ...ticketData,
      replyTo: replyToTicket ?? null,
    });
    return await this.ticketRepository.save(ticket);
  }

  async findAll() {
    const tickets = await this.ticketRepository
      .createQueryBuilder('tickets')
      .where('tickets.replyToId IS NULL')
      .getMany();
    return tickets;
  }

  async findOne(id: number) {
    const ticket = await this.ticketRepository.findOneOrFail({
      where: { id },
      relations: ['replies', 'replyTo'],
    });
    return ticket;
  }
}
