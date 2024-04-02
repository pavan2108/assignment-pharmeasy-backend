import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { CreateCategoriesDto } from '../dto/create-categories.dto';
import { CategoryService } from '../service/category.service';
import { ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';

@Controller('faq/category')
@ApiTags('Category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('/')
  @ApiBody({
    schema: {
      example: {
        categoryNames: ['Delivery', 'Returns'],
      },
    },
  })
  async createCategoryBulk(@Body() createCategoriesDto: CreateCategoriesDto) {
    return this.categoryService.createBulkCategories(createCategoriesDto);
  }

  @Get('/')
  @ApiQuery({
    name: 'page',
    type: Number,
    example: 1,
    required: true,
    allowEmptyValue: false,
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    example: 1,
    required: true,
    allowEmptyValue: false,
  })
  async getCategoryBulk(
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return this.categoryService.findAll({
      page: page,
      limit: limit,
    });
  }

  @Get(':categoryId')
  @ApiQuery({
    name: 'categoryId',
    type: String,
    example: '12131312f',
    required: true,
    allowEmptyValue: false,
  })
  async getParticularCategory(@Param('categoryId') categoryId: string) {
    return this.categoryService.findCategoryById(categoryId);
  }

  @Delete(':categoryId')
  async deleteOneWithId(@Param('categoryId') categoryId: string) {
    return this.categoryService.deleteCategoryById(categoryId);
  }

  @Delete('/')
  async deleteAllCategories() {
    return this.categoryService.deleteAll();
  }
}
