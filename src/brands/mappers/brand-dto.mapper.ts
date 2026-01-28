import slugify from 'slugify';
import { BrandModel } from '../models/brand.model';
import { CreateBrandDto } from '../dtos/requests/create-brand.dto';
import { UpdateBrandDto } from '../dtos/requests/update-brand.dto';
import { BrandResponseDto } from '../dtos/responses/brand-response.dto';

export class BrandDtoMapper {
  static dtoToModel(dto: CreateBrandDto | UpdateBrandDto): BrandModel {
    const result: Partial<BrandModel> = { ...dto };
    if (dto.name) {
      result.slug = slugify(dto.name, { lower: true });
    }
    return new BrandModel({ ...result });
  }

  static modelToResponseDto(model: BrandModel): BrandResponseDto {
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    return {
      id: model.id!,
      name: model.name!,
      slug: model.slug!,
      image: model.image
        ? `${baseUrl}/uploads/brands/${model.image}`
        : undefined,
    };
  }
}
