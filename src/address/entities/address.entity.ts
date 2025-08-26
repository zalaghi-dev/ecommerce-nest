import { Order } from 'src/orders/entities/order.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('addresses')
export class Address {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  province: string;

  @Column()
  city: string;

  @Column()
  address: string;

  @Column()
  postal_code: string;

  @Column({ length: 11 })
  receiver_mobile: string;

  @Column({ length: 10 })
  description: string;

  @ManyToOne(() => User, (user) => user.addresses)
  user: User;

  @OneToMany(() => Order, (order) => order.address)
  orders: Order[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
