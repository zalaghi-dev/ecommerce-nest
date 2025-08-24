import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { In, Repository } from 'typeorm';
import { Category } from 'src/categories/entities/category.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}
  async create(createProductDto: CreateProductDto) {
    const { title, description, price, stock, categoryIds } = createProductDto;
    const product = this.productsRepository.create({
      title,
      description,
      price,
      stock,
    });
    if (categoryIds) {
      const categories = await this.categoryRepository.findBy({
        id: In([categoryIds]),
      });
      product.categories = categories;
    }
    return await this.productsRepository.save(product);
  }
  async findAll() {
    return await this.productsRepository.find({ relations: ['categories'] });
  }
  async findOne(id: number) {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['categories'],
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  // TODO

  // update(id: number, updateProductDto: UpdateProductDto) {
  //   return `This action updates a #${id} product`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} product`;
  // }
}
