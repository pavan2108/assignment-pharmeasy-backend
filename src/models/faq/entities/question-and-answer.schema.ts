import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type QuestionAndAnswerDocument = HydratedDocument<QuestionAndAnswer>;

@Schema({
  timestamps: true,
})
export class QuestionAndAnswer {
  @Prop({
    type: String,
    isRequired: true,
  })
  categoryId: string;

  @Prop({
    type: String,
    isRequired: true,
  })
  question: string;

  @Prop({
    type: String,
    isRequired: true,
  })
  answer: string;
}

export const QuestionAndAnswerSchema =
  SchemaFactory.createForClass(QuestionAndAnswer);
