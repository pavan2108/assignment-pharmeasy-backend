import { Injectable } from '@nestjs/common';
import { QuestionAndAnswerRepository } from '../repository/question-and-answer.repository';
import {
  CreateQuestionAndAnswerBulkDto,
  CreateQuestionAndAnswerDto,
} from '../dto/create-question-and-answer.dto';
import { ReturnObjectType } from '../types/return.object.type';
import { QuestionAndAnswerDocument } from '../entities/question-and-answer.schema';
import mongoose from 'mongoose';

@Injectable()
export class QuestionAndAnswerService {
  constructor(
    private readonly questionAndAnswerRepository: QuestionAndAnswerRepository,
  ) {}

  async createBulkQuestionAndAnswers(
    createQuestionAndAnswerDto: CreateQuestionAndAnswerBulkDto,
  ) {
    const returnObject: ReturnObjectType = {
      success: 0,
      failed: 0,
      successList: [],
      failedList: [],
    };
    for (const questionAndAnswerArrayIndex in createQuestionAndAnswerDto.data) {
      const createQuestionAndAnswerResponse =
        await this.questionAndAnswerRepository.create({
          categoryId:
            createQuestionAndAnswerDto.data[questionAndAnswerArrayIndex]
              .categoryId,
          question:
            createQuestionAndAnswerDto.data[questionAndAnswerArrayIndex]
              .question,
          answer:
            createQuestionAndAnswerDto.data[questionAndAnswerArrayIndex].answer,
        });
      if (createQuestionAndAnswerResponse === null) {
        returnObject.failed += 1;
      } else {
        returnObject.success += 1;
      }
    }
    return returnObject;
  }

  async findQuestionAndAnswerById(options: {
    categoryId: string;
    page: number;
    limit: number;
  }) {
    return this.questionAndAnswerRepository.findAll(
      {
        categoryId: options.categoryId,
      },
      options.page,
      options.limit,
    );
  }

  async updateQuestionAndAnswerById(
    questionAndAnswerData: CreateQuestionAndAnswerDto,
  ) {
    return this.questionAndAnswerRepository.update({
      _id: new mongoose.Types.ObjectId(questionAndAnswerData.categoryId),
      answer: questionAndAnswerData.answer,
      question: questionAndAnswerData.question,
    });
  }

  async deleteQuestionAndAnswerById(questionAndAnswerId: string) {
    return this.questionAndAnswerRepository.deleteOne({
      _id: questionAndAnswerId,
    });
  }

  async deleteQuestionAndAnswersOfCategory(options: { categoryId: string }) {
    return this.questionAndAnswerRepository.deleteAll({
      categoryId: options.categoryId,
    });
  }

  async deleteAll() {
    return this.questionAndAnswerRepository.deleteAll({});
  }
}
