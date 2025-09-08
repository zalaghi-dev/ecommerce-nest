import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Response } from 'express';
import { BookmarkProductDto } from './dto/bookmark-product.dto';
import { BasketProductDto } from './dto/basket-product.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Products Managment')
@ApiBearerAuth()
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(
    @Res() res: Response,
    @Body() createProductDto: CreateProductDto,
  ) {
    const product = await this.productsService.create(createProductDto);
    return res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      data: product,
      message: 'Product created',
    });
  }

  @Post('bookmark-product')
  async bookmarkProduct(
    @Res() res: Response,
    @Body() bookmarkProductDto: BookmarkProductDto,
  ) {
    const bookmarkProduct =
      await this.productsService.toggleBookmark(bookmarkProductDto);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: bookmarkProduct,
      message: 'Product toggled bookmark',
    });
  }

  @Post('add-basket')
  async addItemToBasket(
    @Res() res: Response,
    @Body() basketProductDto: BasketProductDto,
  ) {
    const basketProduct =
      await this.productsService.addItemToBasket(basketProductDto);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: basketProduct,
      message: 'Product added to basket',
    });
  }
  @Post('remove-basket')
  async removeItemFromBasket(
    @Res() res: Response,
    @Body() basketProductDto: BasketProductDto,
  ) {
    const basketProduct =
      await this.productsService.removeItemFromBasket(basketProductDto);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: basketProduct,
      message: 'Product removed from basket',
    });
  }

  @Get()
  async findAll(@Res() res: Response) {
    const products = await this.productsService.findAll();
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: products,
      message: 'Products found',
    });
  }

  @Get(':id')
  async findOne(@Res() res: Response, @Param('id') id: string) {
    const product = await this.productsService.findOne(+id);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: product,
      message: 'Product found',
    });
  }

  @Patch(':id')
  async update(
    @Res() res: Response,
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    const product = await this.productsService.update(+id, updateProductDto);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: product,
      message: 'Product has updated',
    });
  }
}
