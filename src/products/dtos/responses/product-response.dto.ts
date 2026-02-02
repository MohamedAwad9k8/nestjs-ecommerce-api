import { EmbeddedEntityDto } from './embedded-entity.dto';

export class ProductResponseDto {
  id: string;

  title: string;

  slug: string;

  description: string;

  quantity: number;

  sold?: number;

  price: number;

  priceAfterDiscount?: number;

  colors?: string[];

  imageCover?: string;

  images?: string[];

  category?: EmbeddedEntityDto;

  subCategories?: EmbeddedEntityDto[];

  brand?: EmbeddedEntityDto;

  ratingsAverage?: number;

  ratingsQuantity?: number;
}
