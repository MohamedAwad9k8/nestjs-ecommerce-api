import { EmbeddedEntityModel } from './embedded-entity.model';

export class ProductModel {
  id?: string;
  title?: string;
  slug?: string;
  description?: string;
  quantity?: number;
  sold?: number;
  price?: number;
  priceAfterDiscount?: number;
  colors?: string[];
  imageCover?: string;
  images?: string[];
  category?: EmbeddedEntityModel;
  subCategories?: EmbeddedEntityModel[];
  brand?: EmbeddedEntityModel;
  ratingsAverage?: number;
  ratingsQuantity?: number;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(partial: Partial<ProductModel>) {
    Object.assign(this, partial);
  }
}
