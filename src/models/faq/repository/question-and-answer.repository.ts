import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  QuestionAndAnswer,
  QuestionAndAnswerDocument,
} from '../entities/question-and-answer.schema';
import mongoose, { FilterQuery, Model } from 'mongoose';
import { CategoriesDocument } from '../entities/categories.schema';

@Injectable()
export class QuestionAndAnswerRepository {
  constructor(
    @InjectModel(QuestionAndAnswer.name)
    private readonly questionAndAnswerModel: Model<QuestionAndAnswer>,
  ) {}

  async create(
    questionAndAnswerData: Partial<QuestionAndAnswerDocument>,
  ): Promise<QuestionAndAnswerDocument> {
    return this.questionAndAnswerModel.create(questionAndAnswerData);
  }

  async update(
    questionAndAnswerData: Partial<QuestionAndAnswerDocument>,
  ): Promise<QuestionAndAnswerDocument> {
    return this.questionAndAnswerModel.findOneAndUpdate(
      {
        _id: questionAndAnswerData._id,
      },
      {
        ...questionAndAnswerData,
      },
    );
  }

  async findAll(
    questionAndAnswerData: FilterQuery<QuestionAndAnswerDocument>,
    page: number,
    limit: number,
  ): Promise<QuestionAndAnswerDocument[]> {
    return this.questionAndAnswerModel
      .find(questionAndAnswerData)
      .limit(limit)
      .skip(page);
  }

  async deleteOne(
    questionAndAnswerData: FilterQuery<QuestionAndAnswerDocument>,
  ) {
    return this.questionAndAnswerModel.findOneAndDelete({
      _id: questionAndAnswerData._id,
    });
  }

  async deleteAll(
    questionAndAnswerData: FilterQuery<QuestionAndAnswerDocument>,
  ) {
    return this.questionAndAnswerModel.deleteMany(questionAndAnswerData);
  }
}
