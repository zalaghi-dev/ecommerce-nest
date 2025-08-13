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
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Response } from 'express';
import UserRoleEnum from './enums/userRoleEnum';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    const createdUser = await this.usersService.create(createUserDto);
    return res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      data: createdUser,
      message: 'User create success',
    });
  }

  @Get()
  async findAll(
    @Res() res: Response,
    @Query('role') role?: UserRoleEnum,
    @Query('limit') limit: number = 10,
    @Query('page') page: number = 1,
  ) {
    const users = await this.usersService.findAll(role, limit, page);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: users,
      message: 'Users Found',
    });
  }

  @Get(':id')
  async findOne(@Res() res: Response, @Param('id') id: string) {
    const user = await this.usersService.findOne(+id);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: user,
      message: 'User Found',
    });
  }

  @Patch(':id')
  async update(
    @Res() res: Response,
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const updatedUser = await this.usersService.update(+id, updateUserDto);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: updatedUser,
      message: 'User updated!',
    });
  }

  @Delete(':id')
  async remove(@Res() res: Response, @Param('id') id: string) {
    await this.usersService.remove(+id);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: null,
      message: 'User deleted!',
    });
  }
}
