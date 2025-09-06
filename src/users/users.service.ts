import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import UserRoleEnum from './enums/userRoleEnum';
import { Product } from 'src/products/entities/product.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const alreadyUser = await this.findOneByMobile(createUserDto.mobile, true);
    const hashedPassword: string = await bcrypt.hash(
      createUserDto.password,
      12,
    );
    createUserDto.password = hashedPassword;
    if (!alreadyUser) {
      const newUser = this.userRepository.create(createUserDto);
      return await this.userRepository.save(newUser);
    } else throw new BadRequestException('User with this phone already exists');
  }

  async findAll(role?: UserRoleEnum, limit: number = 10, page: number = 10) {
    try {
      const query = this.userRepository.createQueryBuilder('users');
      if (role) {
        query.where('role = :x', { x: role });
      }

      query.skip((page - 1) * limit).take(limit);
      return await query.getMany();
    } catch (error) {
      throw new BadRequestException('Error Getting Users', { cause: error });
    }
  }

  async findOne(id: number) {
    try {
      const user = await this.userRepository.findOneBy({ id });
      if (!user) throw new NotFoundException(`User with id:${id} not found`);
      return user;
    } catch (error) {
      throw new BadRequestException('Error Getting User', { cause: error });
    }
  }
  async findOneByMobile(mobile: string, checkExist: boolean = false) {
    try {
      const user = await this.userRepository.findOneBy({ mobile });
      if (!checkExist)
        if (!user)
          throw new NotFoundException(`User with mobile:${mobile} not found`);
      return user;
    } catch (error) {
      throw new BadRequestException('Error Getting User', { cause: error });
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.findOne(id);
      if (!user) throw new NotFoundException('User not found');
      const { display_name, role } = updateUserDto;
      await this.userRepository.update(id, { display_name, role });
      return await this.findOne(id);
    } catch (error) {
      throw new BadRequestException('Error Updating User', { cause: error });
    }
  }

  async remove(id: number) {
    try {
      const result = await this.userRepository.delete(id);
      if (result.affected === 0) throw new NotFoundException('User Not found');
    } catch (error) {
      throw new BadRequestException('Error Removing User', { cause: error });
    }
  }
  async addProductToBasket(userId: number, product: Product) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['basket_items'],
    });
    if (!user) throw new NotFoundException('User not found');
    user.basket_items.push(product);
    return this.userRepository.save(user);
  }
  async removeProductFromBasket(userId: number, product: Product) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['basket_items'],
    });
    if (!user) throw new NotFoundException('User not found');
    const productIndex = user.basket_items.findIndex(
      (item) => item.id === product.id,
    );
    if (productIndex === -1)
      throw new NotFoundException('Product not found in basket');
    user.basket_items.splice(productIndex, -1);

    return this.userRepository.save(user);
  }
}
