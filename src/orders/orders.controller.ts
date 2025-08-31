import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Response } from 'express';
import { PaymentOrderDto } from './dto/payment-order.dto';
import { VerifyPaymentDto } from './dto/verify-payment.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async create(@Res() res: Response, @Body() createOrderDto: CreateOrderDto) {
    const order = await this.ordersService.create(createOrderDto);
    return res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      data: order,
      message: 'Order created',
    });
  }

  @Get()
  async findAll(@Res() res: Response) {
    const orders = await this.ordersService.findAll();
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: orders,
      message: 'Orders found',
    });
  }

  @Get(':id')
  async findOne(@Res() res: Response, @Param('id') id: string) {
    const order = await this.ordersService.findOne(+id);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: order,
      message: 'Order found',
    });
  }

  @Patch(':id')
  async update(
    @Res() res: Response,
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    const updatedOrder = await this.ordersService.update(+id, updateOrderDto);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: updatedOrder,
      message: 'Order updated',
    });
  }

  @Delete(':id')
  async remove(@Res() res: Response, @Param('id') id: string) {
    await this.ordersService.remove(+id);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: null,
      message: 'Order deleted',
    });
  }
  @Post('/start-payment')
  async startPayment(
    @Body() paymentOrderDto: PaymentOrderDto,
    @Res() res: Response,
  ) {
    const responsePay = await this.ordersService.startPayment(
      paymentOrderDto.order_id,
    );
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        ...responsePay,
        payment_url: `https://gateway.zibal.ir/start/${responsePay.trackId}`,
      },
      message: 'Payment received',
    });
  }
  @Post('/verify-payment')
  async verifyPayment(
    @Body() verifyPaymentDto: VerifyPaymentDto,
    @Res() res: Response,
  ) {
    const responseVerify = await this.ordersService.verifyPayment(
      verifyPaymentDto.track_id,
      verifyPaymentDto.order_id,
    );
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: responseVerify,
      message: 'Verift received',
    });
  }
}
