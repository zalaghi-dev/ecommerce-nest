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
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { Response } from 'express';
import { ApiBearerAuth } from '@nestjs/swagger';
@ApiBearerAuth()
@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  async create(
    @Res() res: Response,
    @Body() createAddressDto: CreateAddressDto,
  ) {
    const address = await this.addressService.create(createAddressDto);
    return res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      data: address,
      message: 'Address Created',
    });
  }

  @Get()
  async findAll(@Res() res: Response) {
    const addresses = await this.addressService.findAll();
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: addresses,
      message: 'Addresses Found',
    });
  }

  @Get(':id')
  async findOne(@Res() res: Response, @Param('id') id: string) {
    const address = await this.addressService.findOne(+id);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: address,
      message: 'Address Found',
    });
  }

  @Patch(':id')
  async update(
    @Res() res: Response,
    @Param('id') id: string,
    @Body() updateAddressDto: UpdateAddressDto,
  ) {
    const updatedAddress = await this.addressService.update(
      +id,
      updateAddressDto,
    );
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: updatedAddress,
      message: 'Address updated!',
    });
  }

  @Delete(':id')
  async remove(@Res() res: Response, @Param('id') id: string) {
    await this.addressService.remove(+id);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: null,
      message: 'Address deleted!',
    });
  }
}
