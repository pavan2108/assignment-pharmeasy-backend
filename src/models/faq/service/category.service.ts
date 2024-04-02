import { Injectable } from '@nestjs/common';
import { CategoriesRepository } from '../repository/categories.repository';
import { CreateCategoriesDto } from '../dto/create-categories.dto';
import { ReturnObjectType } from '../types/return.object.type';
import { PaginationType } from '../types/pagination.type';
import mongoose from 'mongoose';

@Injectable()
export class CategoryService {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  async createBulkCategories(createCategoriesDto: CreateCategoriesDto) {
    const returnObject: ReturnObjectType = {
      success: 0,
      failed: 0,
      successList: [],
      failedList: [],
    };
    for (const categoryIndex in createCategoriesDto.categoryNames) {
      const categoryCreateResponse = await this.categoriesRepository.create({
        categoryName: createCategoriesDto.categoryNames[categoryIndex],
      });
      if (categoryCreateResponse === null) {
        returnObject.failedList.push(
          createCategoriesDto.categoryNames[categoryIndex],
        );
        returnObject.failed += 1;
      } else {
        returnObject.successList.push(
          createCategoriesDto.categoryNames[categoryIndex],
        );
        returnObject.success += 1;
      }
    }
    return returnObject;
  }

  async findCategoryById(id: string) {
    return this.categoriesRepository.findOne({
      _id: id,
    });
  }

  async findCategoryByName(name: string) {
    return this.categoriesRepository.findOne({
      categoryName: name,
    });
  }

  async findAll(pagination: PaginationType) {
    return this.categoriesRepository.findAll(
      {},
      pagination.page,
      pagination.limit,
    );
  }

  async deleteCategoryById(categoryId: string) {
    return this.categoriesRepository.deleteOne({
      _id: new mongoose.Types.ObjectId(categoryId),
    });
  }

  async deleteAll() {
    return this.categoriesRepository.deleteAll();
  }
}
