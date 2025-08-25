import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { In, Repository } from 'typeorm';
import { Category } from 'src/categories/entities/category.entity';
import { BookmarkProduct } from './entities/product-bookmark.entity';
import { BookmarkProductDto } from './dto/bookmark-product.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(BookmarkProduct)
    private readonly bookmarkProductRepository: Repository<BookmarkProduct>,
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly userService: UsersService,
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

  async update(id: number, updateProductDto: UpdateProductDto) {
    const { title, description, price, stock, categoryIds } = updateProductDto;
    const product = await this.findOne(id);
    if (!product) throw new NotFoundException('Product not found');
    if (title) product.title = title;
    if (description) product.description = description;
    if (price) product.price = price;
    if (stock) product.stock = stock;
    if (categoryIds) {
      const categories = await this.categoryRepository.findBy({
        id: In([categoryIds]),
      });
      product.categories = categories;
    }

    return await this.productsRepository.save(product);
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }

  async toggleBookmark(
    bookmarkProductDto: BookmarkProductDto,
  ): Promise<BookmarkProduct | void> {
    const { product_id, user_id } = bookmarkProductDto;

    // Check if product exist
    const product = await this.productsRepository.findOne({
      where: { id: product_id },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Check if user exist
    const user = await this.userService.findOne(user_id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if it is bookmarked or not
    const existing = await this.bookmarkProductRepository.findOne({
      where: {
        product,
        user,
      },
    });

    if (existing) {
      // unbookmark if it is bookmarked
      await this.bookmarkProductRepository.remove(existing);
    } else {
      // bookmark if it is unbookmarked
      const bookmark = this.bookmarkProductRepository.create({
        product,
        user,
      });
      const bookmarkProduct =
        await this.bookmarkProductRepository.save(bookmark);
      return bookmarkProduct;
    }
  }
}
