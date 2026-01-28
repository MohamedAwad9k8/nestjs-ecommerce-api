import slugify from 'slugify';
import { ProductModel } from '../models/product.model';
import { CreateProductDto } from '../dtos/requests/create-product.dto';
import { UpdateProductDto } from '../dtos/requests/update-product.dto';
import { ProductResponseDto } from '../dtos/responses/product-response.dto';
import { EmbeddedEntityMapper } from './embedded-entity.mapper';

export class ProductDtoMapper {
  static dtoToModel(dto: CreateProductDto | UpdateProductDto): ProductModel {
    const result: Partial<ProductModel> = {
      title: dto.title,
      description: dto.description,
      quantity: dto.quantity,
      sold: dto.sold,
      price: dto.price,
      colors: dto.colors,
      imageCover: dto.imageCover,
      images: dto.images,
    };

    if (dto.title) {
      result.slug = slugify(dto.title, { lower: true });
    }
    result.category = dto.category
      ? EmbeddedEntityMapper.dtoToModel(dto.category)
      : undefined;

    result.subCategories = dto.subCategories
      ? dto.subCategories.map((id) => EmbeddedEntityMapper.dtoToModel(id))
      : undefined;

    result.brand = dto.brand
      ? EmbeddedEntityMapper.dtoToModel(dto.brand)
      : undefined;

    return new ProductModel(result);
  }

  static modelToResponseDto(model: ProductModel): ProductResponseDto {
    return {
      id: model.id!,
      title: model.title!,
      slug: model.slug!,

      description: model.description!,

      quantity: model.quantity!,

      sold: model.sold,

      price: model.price!,

      priceAfterDiscount: model.priceAfterDiscount,

      colors: model.colors,

      imageCover: model.imageCover!,

      images: model.images,

      category: EmbeddedEntityMapper.modelToDto(model.category!),

      subCategories: model.subCategories?.map((sub) =>
        EmbeddedEntityMapper.modelToDto(sub),
      ),

      brand: model.brand
        ? EmbeddedEntityMapper.modelToDto(model.brand)
        : undefined,

      ratingsAverage: model.ratingsAverage,

      ratingsQuantity: model.ratingsQuantity,
    };
  }
}
