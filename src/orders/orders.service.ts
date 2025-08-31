import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UsersService } from 'src/users/users.service';
import { AddressService } from 'src/address/address.service';
import { ProductsService } from 'src/products/products.service';
import { UpdateOrderDto } from './dto/update-order.dto';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { OrderStatus } from './enums/order-status.enum';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,

    @InjectRepository(OrderItem)
    private readonly orderItemRepo: Repository<OrderItem>,

    private readonly userService: UsersService,
    private readonly addressService: AddressService,
    private readonly productService: ProductsService,
    private readonly httpService: HttpService,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const { userId, addressId, items, discount_code, status, payed_time } =
      createOrderDto;

    const user = await this.userService.findOne(userId);
    if (!user) throw new NotFoundException('User not found');

    const address = await this.addressService.findOne(addressId);
    if (!address) throw new NotFoundException('Address not found');

    const order = this.orderRepo.create({
      user,
      address,
      discount_code,
      status,
      payed_time,
    });

    const savedOrder = await this.orderRepo.save(order);

    // ساخت آیتم‌های سفارش
    const orderItems: OrderItem[] = [];
    let totalPrice = 0;
    for (const itemDto of items) {
      const product = await this.productService.findOne(itemDto.productId);
      if (!product) {
        throw new NotFoundException(
          `Product with id ${itemDto.productId} not found`,
        );
      }
      totalPrice += product.price;
      const orderItem = this.orderItemRepo.create({
        order: savedOrder,
        product,
        // quantity: itemDto.quantity,
      });

      orderItems.push(orderItem);
    }

    await this.orderItemRepo.save(orderItems);
    await this.orderRepo.update(
      { id: savedOrder.id },
      { total_price: totalPrice },
    );
    //return item
    return this.orderRepo.findOne({
      where: { id: savedOrder.id },
      relations: ['items', 'items.product', 'user', 'address'],
    });
  }

  async findAll() {
    return this.orderRepo.find({
      relations: ['items', 'items.product', 'user', 'address'],
    });
  }

  async findOne(id: number) {
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: ['items', 'items.product', 'user', 'address'],
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async remove(id: number) {
    const order = await this.findOne(id);
    return this.orderRepo.remove(order);
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: ['items', 'items.product', 'user', 'address'],
    });
    if (!order) throw new NotFoundException('Order not found');

    const { userId, addressId, items, discount_code, status, payed_time } =
      updateOrderDto;

    if (userId) {
      const user = await this.userService.findOne(userId);
      if (!user) throw new NotFoundException('User not found');
      order.user = user;
    }

    if (addressId) {
      const address = await this.addressService.findOne(addressId);
      if (!address) throw new NotFoundException('Address not found');
      order.address = address;
    }

    if (typeof discount_code !== 'undefined') {
      order.discount_code = discount_code;
    }

    if (typeof status !== 'undefined') {
      order.status = status;
    }

    if (typeof payed_time !== 'undefined') {
      order.payed_time = payed_time;
    }

    if (items && items.length > 0) {
      await this.orderItemRepo.delete({ order: { id: order.id } });

      const orderItems: OrderItem[] = [];
      for (const itemDto of items) {
        const product = await this.productService.findOne(itemDto.productId);
        if (!product) {
          throw new NotFoundException(
            `Product with id ${itemDto.productId} not found`,
          );
        }

        const orderItem = this.orderItemRepo.create({
          order,
          product,
          // quantity: itemDto.quantity,
        });
        orderItems.push(orderItem);
      }
      await this.orderItemRepo.save(orderItems);
    }

    await this.orderRepo.save(order);

    return this.orderRepo.findOne({
      where: { id: order.id },
      relations: ['items', 'items.product', 'user', 'address'],
    });
  }
  async startPayment(order_id: number) {
    const order = await this.findOne(order_id);
    if (!order) throw new NotFoundException('Order not found');

    const res$ = this.httpService.post('https://gateway.zibal.ir/v1/request', {
      merchant: 'zibal',
      callbackUrl: 'http://localhost:3333',
      orderId: 2,
      amount: order.total_price * 10 /* Toman to Rial */,
    });
    const res = await lastValueFrom(res$);
    return res.data;
  }
  async verifyPayment(track_id: number, order_id: number) {
    const res$ = this.httpService.post('https://gateway.zibal.ir/v1/verify', {
      merchant: 'zibal',
      track_id,
    });
    const res = await lastValueFrom(res$);
    if (res.data.result === 100) {
      const order = await this.findOne(order_id);
      if (!order) throw new NotFoundException('Order not found');
      order.status = OrderStatus.COMPLETED;
      await this.orderRepo.save(order);
    }
    return res.data;
  }
}
