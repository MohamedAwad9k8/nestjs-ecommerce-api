import slugify from 'slugify';
import { SubCategoryModel } from '../models/sub-category.model';
import { CreateSubCategoryDto } from '../dtos/requests/create-sub-category.dto';
import { UpdateSubCategoryDto } from '../dtos/requests/update-sub-category.dto';
import { SubCategoryResponseDto } from '../dtos/responses/sub-category-response.dto';

export class SubCategoryDtoMapper {
  static dtoToModel(
    dto: CreateSubCategoryDto | UpdateSubCategoryDto,
  ): SubCategoryModel {
    const result: Partial<SubCategoryModel> = { ...dto };
    if (dto.name) {
      result.slug = slugify(dto.name, { lower: true });
    }
    return new SubCategoryModel({ ...result });
  }

  static modelToResponseDto(model: SubCategoryModel): SubCategoryResponseDto {
    return {
      id: model.id!,
      name: model.name!,
      slug: model.slug!,
      category: model.category!,
    };
  }
}
