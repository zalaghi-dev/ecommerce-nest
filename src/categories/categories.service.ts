import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}
  async create(createCategoryDto: CreateCategoryDto) {
    const category = this.categoryRepository.create(createCategoryDto);
    return await this.categoryRepository.save(category);
  }

  async findAll() {
    return await this.categoryRepository.find({ relations: ['products'] });
  }
  async findOne(id: number) {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['products'],
    });
    if (!category) throw new NotFoundException(`Category ${id} not found`);
    return category;
  }
  async removeOnlyCategories(id: number) {
    //! REMOVE RELATIONS FROM PRODUCT
    const category = await this.findOne(id);
    category.products = [];
    await this.categoryRepository.save(category);
    // THEN REMOVE
    return await this.categoryRepository.remove(category);
  }
}
