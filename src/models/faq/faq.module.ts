import { Module } from '@nestjs/common';
import { CategoryController } from './controller/category.controller';
import { CategoryService } from './service/category.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Categories, CategoriesSchema } from './entities/categories.schema';
import { CategoriesRepository } from './repository/categories.repository';
import {
  QuestionAndAnswer,
  QuestionAndAnswerSchema,
} from './entities/question-and-answer.schema';
import { QuestionAndAnswerController } from './controller/question-and-answer.controller';
import { QuestionAndAnswerService } from './service/question-and-answer.service';
import { QuestionAndAnswerRepository } from './repository/question-and-answer.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Categories.name,
        schema: CategoriesSchema,
      },
      {
        name: QuestionAndAnswer.name,
        schema: QuestionAndAnswerSchema,
      },
    ]),
  ],
  controllers: [CategoryController, QuestionAndAnswerController],
  providers: [
    CategoryService,
    CategoriesRepository,
    QuestionAndAnswerService,
    QuestionAndAnswerRepository,
  ],
})
export class FaqModule {}
