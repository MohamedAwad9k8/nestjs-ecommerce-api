import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from '../dtos/requests/create-category.dto';
import { UpdateCategoryDto } from '../dtos/requests/update-category.dto';
import { GetAllResults } from 'src/common/api-features/types/pagination-results.types';
import { apiPaginationFeaturesDto } from '../../common/api-features/dtos/requests/api-pagination-features.dto';
import { StorageService } from 'src/common/storage/storage.service';
import { CategoryRepository } from '../repositories/category.repository';
import { CategoryDtoMapper } from '../mappers/category-dto.mapper';
import { CategoryResponseDto } from '../dtos/responses/category-response.dto';
import { QueryObjDtoMapper } from '../../common/api-features/mappers/query-dto.mapper';
import { CategoryModel } from '../models/category.model';

@Injectable()
export class CategoriesService {
  constructor(
    private readonly storageService: StorageService,
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async findAll(
    queryObjDto: apiPaginationFeaturesDto,
  ): Promise<GetAllResults<CategoryResponseDto>> {
    // Map Query Obj from Dto to Model
    const QueryObjModel = QueryObjDtoMapper.dtoToModel(queryObjDto);
    // Use Repository To Get Data
    const { paginationResult, models } =
      await this.categoryRepository.findAll(QueryObjModel);
    // Change Model to Response DTO
    const cleanedResult = {
      results: models.length,
      paginationResult,
      data: models.map((doc: CategoryModel) =>
        CategoryDtoMapper.modelToResponseDto(doc),
      ),
    };
    // Return Response
    return cleanedResult;
  }

  async findOneById(id: string): Promise<CategoryResponseDto> {
    // Use Repository To Get Data
    const category = await this.categoryRepository.findOneById(id);
    // Change Model to Response DTO
    const responseDto = CategoryDtoMapper.modelToResponseDto(category);
    // Return Response
    return responseDto;
  }

  async create(
    createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryResponseDto> {
    // Map DTO to Model
    const model = CategoryDtoMapper.dtoToModel(createCategoryDto);
    // Use Repository to Create Record in DB
    const category = await this.categoryRepository.createOne(model);
    // Map Result to Response DTO
    const result = CategoryDtoMapper.modelToResponseDto(category);
    // Return Response
    return result;
  }

  async updateById(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<CategoryResponseDto> {
    // Map DTO to Model
    const model = CategoryDtoMapper.dtoToModel(updateCategoryDto);
    // Use Repository to Update Record in DB
    const category = await this.categoryRepository.updateOneById(id, model);
    // Map Result to Response DTO
    const result = CategoryDtoMapper.modelToResponseDto(category);
    // Return Response
    return result;
  }

  async removeById(id: string): Promise<void> {
    // Use Repository To Delete Record
    await this.categoryRepository.deleteById(id);
  }

  // Handling Category Image Upload
  async uploadCategoryImage(file: Express.Multer.File): Promise<string> {
    // Use Storage Service to Process and Store the Image
    const fileName = await this.storageService.processImage({
      file,
      dirName: 'categories',
      width: 600,
      height: 600,
      quality: 90,
    });

    // Return the Stored Image Filename or URL
    return fileName;
  }
}
