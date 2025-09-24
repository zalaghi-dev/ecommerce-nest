import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
} from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { Response } from 'express';
import { ApiBearerAuth } from '@nestjs/swagger';
import Role from 'src/users/enums/Role';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Permissions } from 'src/auth/decorators/permissions.decorator';
import { ResponseInterceptor } from 'src/interceptors/response.interceptor';
@ApiBearerAuth()
@Roles(Role.NormalUser)
@UseInterceptors(ResponseInterceptor)
@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  async create(@Body() createAddressDto: CreateAddressDto) {
    const address = await this.addressService.create(createAddressDto);
    return address;
  }

  @Get()
  async findAll() {
    const addresses = await this.addressService.findAll();
    return addresses;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const address = await this.addressService.findOne(+id);
    return address;
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAddressDto: UpdateAddressDto,
  ) {
    const updatedAddress = await this.addressService.update(
      +id,
      updateAddressDto,
    );
    return updatedAddress;
  }
  @Permissions('address:delete:own')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.addressService.remove(+id);
    return 'removed';
  }
}
