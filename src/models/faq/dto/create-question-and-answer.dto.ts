import { ApiProperty } from '@nestjs/swagger';

export class CreateQuestionAndAnswerDto {
  categoryId: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  question: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  answer: string;
}

export class CreateQuestionAndAnswerBulkDto {
  @ApiProperty({
    type: CreateQuestionAndAnswerDto,
    isArray: true,
  })
  data: [CreateQuestionAndAnswerDto];
}
