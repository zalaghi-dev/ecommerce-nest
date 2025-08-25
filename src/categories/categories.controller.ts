import {
  Controller,
  Get,
  Post,
  Body,
  Res,
  HttpStatus,
  Delete,
  Param,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Response } from 'express';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  async create(
    @Res() res: Response,
    @Body() createCategoryDto: CreateCategoryDto,
  ) {
    const newCategory = await this.categoriesService.create(createCategoryDto);
    return res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      data: newCategory,
      message: 'Category created',
    });
  }

  @Get()
  async findAll(@Res() res: Response) {
    const categories = await this.categoriesService.findAll();
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: categories,
      message: 'Categories found',
    });
  }
  @Delete('remove-only-category/:id')
  async remove(@Res() res: Response, @Param('id') id: string) {
    await this.categoriesService.removeOnlyCategories(+id);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: null,
      message: 'Remove Only Categories Success!',
    });
  }
}
