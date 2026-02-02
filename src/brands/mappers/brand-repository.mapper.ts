import { Brand } from '../schemas/brand.schema';
import { BrandModel } from '../models/brand.model';
import { BrandDocument } from '../repositories/brand.repository';

export class BrandRepositoryMapper {
  static schemaToModel(brand: BrandDocument): BrandModel {
    return new BrandModel({
      id: brand._id?.toString(),
      name: brand.name,
      slug: brand.slug,
      image: brand.image,
      createdAt: brand.createdAt,
      updatedAt: brand.updatedAt,
    });
  }

  static modelToSchema(model: BrandModel): Partial<Brand> {
    return {
      name: model.name,
      slug: model.slug,
      image: model.image,
      // _id and timestamps handled by mongoose automatically
    };
  }
}
