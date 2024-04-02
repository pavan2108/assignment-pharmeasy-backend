import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { QuestionAndAnswerService } from '../service/question-and-answer.service';
import {
  CreateQuestionAndAnswerBulkDto,
  CreateQuestionAndAnswerDto,
} from '../dto/create-question-and-answer.dto';

@Controller('faq/question_and_answer')
@ApiTags('Question And Answer')
export class QuestionAndAnswerController {
  constructor(
    private readonly questionAndAnswerService: QuestionAndAnswerService,
  ) {}

  @Post(':categoryId')
  @ApiParam({
    name: 'categoryId',
    type: String,
    example: '660c5052a6a6963d7db012e0',
    required: true,
  })
  async createQuestionAndAnswerBulk(
    @Body() createQuestionAndAnswerDto: CreateQuestionAndAnswerBulkDto,
    @Param('categoryId') categoryId: string,
  ) {
    for (const index in createQuestionAndAnswerDto.data) {
      createQuestionAndAnswerDto.data[index].categoryId = categoryId;
    }
    return this.questionAndAnswerService.createBulkQuestionAndAnswers(
      createQuestionAndAnswerDto,
    );
  }

  @Get(':categoryId')
  @ApiParam({
    name: 'categoryId',
    type: String,
    example: '660c5052a6a6963d7db012e0',
    required: true,
  })
  @ApiQuery({
    name: 'page',
    type: Number,
    example: 0,
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
  async getQuestionAndAnswerBulk(
    @Param('categoryId') categoryId: string,
    @Param('page') page: number,
    @Param('limit') limit: number,
  ) {
    return this.questionAndAnswerService.findQuestionAndAnswerById({
      categoryId: categoryId,
      page: page,
      limit: limit,
    });
  }

  @Delete(':categoryId')
  @ApiParam({
    name: 'categoryId',
    type: String,
    example: '660c5052a6a6963d7db012e0',
    required: true,
  })
  async deleteByCategoryId(@Param('categoryId') categoryId: string) {
    return this.questionAndAnswerService.deleteQuestionAndAnswersOfCategory({
      categoryId: categoryId,
    });
  }

  @Delete('by_id/:questionAndAnswerId')
  @ApiParam({
    name: 'questionAndAnswerId',
    type: String,
    example: '660c5052a6a6963d7db012e0',
    required: true,
  })
  async deleteByCategoryIdAndQuestionAndAnswerId(
    @Param('questionAndAnswerId') questionAndAnswerId: string,
  ) {
    return this.questionAndAnswerService.deleteQuestionAndAnswerById(
      questionAndAnswerId,
    );
  }

  @Put('by_id/:questionAndAnswerId')
  @ApiParam({
    name: 'questionAndAnswerId',
    type: String,
    example: '660c5052a6a6963d7db012e0',
    required: true,
  })
  async updateQuestionAndAnswerWithId(
    @Param('questionAndAnswerId') questionAndAnswerId: string,
    @Body() createQuestionAndAnswerDto: CreateQuestionAndAnswerDto,
  ) {
    return this.questionAndAnswerService.updateQuestionAndAnswerById({
      categoryId: questionAndAnswerId,
      answer: createQuestionAndAnswerDto.answer,
      question: createQuestionAndAnswerDto.question,
    });
  }
}
