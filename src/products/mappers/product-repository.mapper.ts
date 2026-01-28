import { Types } from 'mongoose';
import { Product } from '../schemas/product.schema';
import { ProductModel } from '../models/product.model';
import { EmbeddedEntityModel } from '../models/embedded-entity.model';
import { ProductDocument } from '../repositories/product.repository';

export class ProductRepositoryMapper {
  static schemaToModel(product: ProductDocument): ProductModel {
    return new ProductModel({
      id: product._id?.toString(),
      title: product.title,
      slug: product.slug,
      description: product.description,
      quantity: product.quantity,
      sold: product.sold,
      price: product.price,
      priceAfterDiscount: product.priceAfterDiscount,
      colors: product.colors,
      imageCover: product.imageCover,
      images: product.images,

      category: product.category
        ? new EmbeddedEntityModel({ id: product.category.toString() })
        : undefined,

      subCategories: product.subCategories?.map(
        (id) => new EmbeddedEntityModel({ id: id.toString() }),
      ),

      brand: product.brand
        ? new EmbeddedEntityModel({ id: product.brand.toString() })
        : undefined,

      ratingsAverage: product.ratingsAverage,
      ratingsQuantity: product.ratingsQuantity,

      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    });
  }

  static modelToSchema(model: ProductModel): Partial<Product> {
    return {
      title: model.title,
      slug: model.slug,
      description: model.description,
      quantity: model.quantity,
      sold: model.sold,
      price: model.price,
      priceAfterDiscount: model.priceAfterDiscount,
      colors: model.colors,
      imageCover: model.imageCover,
      images: model.images,
      category: model.category
        ? new Types.ObjectId(model.category.id)
        : undefined,
      subCategories: model.subCategories?.map(
        (sub) => new Types.ObjectId(sub.id),
      ),
      brand: model.brand ? new Types.ObjectId(model.brand.id) : undefined,

      // _id and timestamps handled by mongoose automatically
    };
  }
}
