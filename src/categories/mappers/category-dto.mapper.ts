import slugify from 'slugify';
import { CategoryModel } from '../models/category.model';
import { CreateCategoryDto } from '../dtos/requests/create-category.dto';
import { UpdateCategoryDto } from '../dtos/requests/update-category.dto';
import { CategoryResponseDto } from '../dtos/responses/category-response.dto';

export class CategoryDtoMapper {
  static dtoToModel(dto: CreateCategoryDto | UpdateCategoryDto): CategoryModel {
    const result: Partial<CategoryModel> = { ...dto };
    if (dto.name) {
      result.slug = slugify(dto.name, { lower: true });
    }
    return new CategoryModel({ ...result });
  }

  static modelToResponseDto(model: CategoryModel): CategoryResponseDto {
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    return {
      id: model.id!,
      name: model.name!,
      slug: model.slug!,
      image: model.image
        ? `${baseUrl}/uploads/categories/${model.image}`
        : undefined,
    };
  }
}
