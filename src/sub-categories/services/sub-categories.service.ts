import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSubCategoryDto } from '../dtos/requests/create-sub-category.dto';
import { UpdateSubCategoryDto } from '../dtos/requests/update-sub-category.dto';
import { GetAllResults } from 'src/common/api-features/types/pagination-results.types';
import { CategoryApiFeaturesDto } from '../../common/api-features/dtos/requests/category-api-features.dto';
import { SubCategoryRepository } from '../repositories/sub-category.repository';
import { CategoryRepository } from '../../categories/repositories/category.repository';
import { SubCategoryDtoMapper } from '../mappers/sub-category-dto.mapper';
import { SubCategoryResponseDto } from '../dtos/responses/sub-category-response.dto';
import { QueryObjDtoMapper } from '../../common/api-features/mappers/query-dto.mapper';
import { SubCategoryModel } from '../models/sub-category.model';
import { NestedRouteDto } from '../dtos/requests/sub-category-nested-routes.dto';

@Injectable()
export class SubCategoriesService {
  constructor(
    private readonly subCategoryRepository: SubCategoryRepository,
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async findAll(
    queryObjDto: CategoryApiFeaturesDto,
    filterByCategory?: string,
  ): Promise<GetAllResults<SubCategoryResponseDto>> {
    // Map Query Obj from Dto to Model
    const QueryObjModel = QueryObjDtoMapper.dtoToModel(queryObjDto);

    // Use Repository To Get Data
    const { paginationResult, models } =
      await this.subCategoryRepository.findAll(QueryObjModel, filterByCategory);
    // Change Model to Response DTO
    const cleanedResult = {
      results: models.length,
      paginationResult,
      data: models.map((doc: SubCategoryModel) =>
        SubCategoryDtoMapper.modelToResponseDto(doc),
      ),
    };
    // Return Response
    return cleanedResult;
  }

  async findOneById(id: string): Promise<SubCategoryResponseDto> {
    // Use Repository To Get Data
    const subCategory = await this.subCategoryRepository.findOneById(id);
    // Change Model to Response DTO
    const responseDto = SubCategoryDtoMapper.modelToResponseDto(subCategory);
    // Return Response
    return responseDto;
  }

  async create(
    createSubCategoryDto: CreateSubCategoryDto | NestedRouteDto,
  ): Promise<SubCategoryResponseDto> {
    // Map DTO to Model
    const model = SubCategoryDtoMapper.dtoToModel(createSubCategoryDto);
    // Check If Category Exists
    const categoryExists = await this.categoryRepository.isCategoryIDExists(
      model.category!,
    );
    if (!categoryExists) {
      throw new NotFoundException('Category does not exist');
    }
    // Use Repository to Create Record in DB
    const subCategory = await this.subCategoryRepository.createOne(model);
    // Map Result to Response DTO
    const result = SubCategoryDtoMapper.modelToResponseDto(subCategory);
    // Return Response
    return result;
  }

  async updateById(
    id: string,
    updateSubCategoryDto: UpdateSubCategoryDto,
  ): Promise<SubCategoryResponseDto> {
    // Map DTO to Model
    const model = SubCategoryDtoMapper.dtoToModel(updateSubCategoryDto);
    // Check If Category Exists
    if (model.category) {
      const categoryExists = await this.categoryRepository.isCategoryIDExists(
        model.category,
      );
      if (!categoryExists) {
        throw new NotFoundException('Category does not exist');
      }
    }
    // Use Repository to Update Record in DB
    const subCategory = await this.subCategoryRepository.updateOneById(
      id,
      model,
    );
    // Map Result to Response DTO
    const result = SubCategoryDtoMapper.modelToResponseDto(subCategory);
    // Return Response
    return result;
  }

  async removeById(id: string): Promise<void> {
    // Use Repository To Delete Record
    await this.subCategoryRepository.deleteById(id);
  }
}
