import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateCategoriesDto {
  @ApiProperty({
    name: 'categoryNames',
    example: ['Delivery', 'Returns'],
    required: true,
    isArray: true,
  })
  @IsNotEmpty()
  categoryNames: string[];
}
