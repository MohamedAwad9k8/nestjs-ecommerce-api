import { Types } from 'mongoose';
import { SubCategory } from '../schemas/sub-category.schema';
import { SubCategoryModel } from '../models/sub-category.model';
import { SubCategoryDocument } from '../repositories/sub-category.repository';

export class SubCategoryRepositoryMapper {
  static schemaToModel(subCategory: SubCategoryDocument): SubCategoryModel {
    return new SubCategoryModel({
      id: subCategory._id?.toString(),
      name: subCategory.name,
      slug: subCategory.slug,
      category: subCategory.category?.toString(),
      createdAt: subCategory.createdAt,
      updatedAt: subCategory.updatedAt,
    });
  }

  static modelToSchema(model: SubCategoryModel): Partial<SubCategory> {
    return {
      name: model.name,
      slug: model.slug,
      category: new Types.ObjectId(model.category),
      // _id and timestamps handled by mongoose automatically
    };
  }
}
