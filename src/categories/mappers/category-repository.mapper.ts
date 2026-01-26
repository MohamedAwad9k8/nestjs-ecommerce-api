import { Category } from '../schemas/category.schema';
import { CategoryModel } from '../models/category.model';
import { CategoryDocument } from '../repositories/category.repository';

export class CategoryRepositoryMapper {
  static schemaToModel(category: CategoryDocument): CategoryModel {
    return new CategoryModel({
      id: category._id.toString(),
      name: category.name,
      slug: category.slug,
      image: category.image,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    });
  }

  static modelToSchema(model: CategoryModel): Partial<Category> {
    return {
      name: model.name,
      slug: model.slug,
      image: model.image,
      // _id and timestamps handled by mongoose automatically
    };
  }
}
