import { InjectModel } from '@nestjs/mongoose';
import { Categories, CategoriesDocument } from '../entities/categories.schema';
import mongoose, { FilterQuery, Model } from 'mongoose';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CategoriesRepository {
  constructor(
    @InjectModel(Categories.name)
    private readonly categoriesModel: Model<Categories>,
  ) {}

  async create(
    categoryData: Partial<CategoriesDocument>,
  ): Promise<CategoriesDocument> {
    return this.categoriesModel.create({
      categoryName: categoryData.categoryName,
    });
  }

  async update(
    categoryData: Partial<CategoriesDocument>,
  ): Promise<CategoriesDocument> {
    return this.categoriesModel.findOneAndUpdate(
      {
        _id: categoryData._id,
      },
      {
        categoryName: categoryData.categoryName,
      },
    );
  }

  async findOne(categoryData: FilterQuery<CategoriesDocument>) {
    return this.categoriesModel.findOne(categoryData);
  }

  async findAll(
    categoryData: FilterQuery<CategoriesDocument>,
    page: number,
    limit: number,
  ): Promise<CategoriesDocument[]> {
    return this.categoriesModel.find(categoryData).limit(limit).skip(page);
  }

  async deleteOne(categories: Partial<CategoriesDocument>) {
    categories._id = new mongoose.Types.ObjectId(categories._id);
    return this.categoriesModel.findOneAndDelete({
      _id: categories._id,
    });
  }

  async deleteAll() {
    return this.categoriesModel.deleteMany();
  }
}
