import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from './entities/address.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async create(createAddressDto: CreateAddressDto) {
    const { userId, ...addressData } = createAddressDto;
    const user = await this.userRepository.findOneByOrFail({ id: userId });

    const address = this.addressRepository.create({
      user,
      ...addressData,
    });
    return await this.addressRepository.save(address);
  }

  async findAll() {
    return await this.addressRepository.find({ relations: ['user'] });
  }

  async findOne(id: number) {
    const address = await this.addressRepository.findOneBy({ id });
    if (!address) throw new NotFoundException('Address not found');
    return address;
  }

  async update(id: number, updateAddressDto: UpdateAddressDto) {
    const address = await this.findOne(id);
    Object.assign(address, updateAddressDto);
    return await this.addressRepository.save(address);
  }

  async remove(id: number) {
    const address = await this.findOne(id);
    await this.addressRepository.remove(address);
  }
}
