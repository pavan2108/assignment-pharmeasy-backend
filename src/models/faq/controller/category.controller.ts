import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { CreateCategoriesDto } from '../dto/create-categories.dto';
import { CategoryService } from '../service/category.service';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ReturnObjectType } from '../types/return.object.type';
import { QuestionAndAnswerService } from '../service/question-and-answer.service';

@Controller('faq/category')
@ApiTags('Category')
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly questionAndAnswerService: QuestionAndAnswerService,
  ) {}

  private hasNumber(myString: string) {
    return /\d/.test(myString);
  }

  @Post('/')
  @ApiBody({
    type: CreateCategoriesDto,
  })
  @ApiOperation({
    summary: 'Create new categories',
    description:
      '#### This endpoint helps in creating categories in bulk. \n' +
      '#### This api expects to pass array of category names to be created, it is having few pre conditions before creating category and saving it.\n' +
      '#### Condition 1 : It should have length of more than 4 characters.\n' +
      '#### Condition 2 : It should not contain and number.\n' +
      '#### Condition 3 : Category names should not be duplicated.\n' +
      '#### Failing any of the conditions will not create the category',
  })
  @ApiResponse({
    schema: {
      example: {
        success: 0,
        failed: 2,
        successList: [],
        failedList: ['Delivery', 'Returns'],
      },
    },
  })
  async createCategoryBulk(@Body() createCategoriesDto: CreateCategoriesDto) {
    // checking if categories already exists
    const returnObject: ReturnObjectType = {
      success: 0,
      failed: 0,
      successList: [],
      failedList: [],
    };
    for (const index in createCategoriesDto.categoryNames) {
      const categoryName = createCategoriesDto.categoryNames[index];
      if (categoryName.length <= 4 || this.hasNumber(categoryName)) {
        returnObject.failed += 1;
        returnObject.failedList.push(categoryName);
        delete createCategoriesDto.categoryNames[index];
      } else {
        const doesCategoryExists =
          await this.categoryService.findCategoryByName(categoryName);
        if (doesCategoryExists !== null) {
          returnObject.failed += 1;
          returnObject.failedList.push(categoryName);
          delete createCategoriesDto.categoryNames[index];
        }
      }
    }
    const createCategoryResponses =
      await this.categoryService.createBulkCategories(createCategoriesDto);
    returnObject.success += createCategoryResponses.success;
    returnObject.failed += createCategoryResponses.failed;
    returnObject.failedList = [
      ...createCategoryResponses.failedList,
      ...returnObject.failedList,
    ];
    returnObject.successList = [
      ...createCategoryResponses.successList,
      ...returnObject.successList,
    ];
    return returnObject;
  }

  @Get('/')
  @ApiOperation({
    summary: 'Fetches list of categories',
    description:
      '#### This endpoint fetches the categories list is bulk \n' +
      '#### The api expected two values as query parameters. \n' +
      '#### 1. Page \n' +
      '#### 2 Limit \n' +
      '#### They should satisfy the following conditions.\n' +
      '#### Condition 1 : Page should never be less than 0 and only whole numbers are allowed.\n' +
      '#### Condition 1 : Limit should never be less than 1 and only whole numbers are allowed.\n' +
      '#### Failing any of the conditions will set the value to their default.\n ' +
      '#### For page it is 0 and for limit it is 1',
  })
  @ApiOkResponse({
    schema: {
      example: [
        {
          _id: '660c5052a6a6963d7db012e0',
          categoryName: 'Delivery',
          createdAt: '2024-04-02T18:37:06.704Z',
          updatedAt: '2024-04-02T18:37:06.704Z',
          __v: 0,
        },
        {
          _id: '660c5052a6a6963d7db012e2',
          categoryName: 'Returns',
          createdAt: '2024-04-02T18:37:06.758Z',
          updatedAt: '2024-04-02T18:37:06.758Z',
          __v: 0,
        },
      ],
    },
  })
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
    if (page < 0 || page - Math.floor(page) !== 0) page = 0;
    if (limit < 1 || limit - Math.floor(limit) !== 0) limit = 1;
    return this.categoryService.findAll({
      page: page,
      limit: limit,
    });
  }

  @Get(':categoryId')
  @ApiParam({
    name: 'categoryId',
    type: String,
    example: '660c5052a6a6963d7db012e0',
    required: true,
    allowEmptyValue: false,
  })
  async getParticularCategory(@Param('categoryId') categoryId: string) {
    const isCategoryExist = await this.categoryService.findCategoryById(
      categoryId,
    );
    if (isCategoryExist === null) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          errors: {
            message: 'category not found',
          },
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return this.categoryService.findCategoryById(categoryId);
  }

  @Delete(':categoryId')
  @ApiParam({
    name: 'categoryId',
    type: String,
    example: '660c5052a6a6963d7db012e0',
    required: true,
    allowEmptyValue: false,
    description:
      '#### It is the id of category you want to delete, It deletes all the question and answer data linked with this categories',
  })
  async deleteOneWithId(@Param('categoryId') categoryId: string) {
    const isCategoryExist = await this.categoryService.findCategoryById(
      categoryId,
    );
    if (isCategoryExist === null) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          errors: {
            message: 'category not found',
          },
        },
        HttpStatus.NOT_FOUND,
      );
    }
    await this.categoryService.deleteCategoryById(categoryId);
    await this.questionAndAnswerService.deleteQuestionAndAnswersOfCategory({
      categoryId: categoryId,
    });
  }

  @Delete('/')
  @ApiOperation({
    summary: 'Deletes all the categories',
    description:
      '#### This api deletes all the categories and question and answers of all categories',
  })
  async deleteAllCategories() {
    await this.categoryService.deleteAll();
    await this.questionAndAnswerService.deleteAll();
    return 'All entries deleted';
  }
}
