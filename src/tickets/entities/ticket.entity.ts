import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('tickets')
export class Ticket {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  subject: string;

  @Column()
  description: string;

  @ManyToOne(() => User, (user) => user.tickets)
  user: User;

  @ManyToOne(() => Ticket, (ticket) => ticket.replies, { nullable: true })
  replyTo: Ticket | null;

  @OneToMany(() => Ticket, (ticket) => ticket.replyTo)
  replies: Ticket[];
}
