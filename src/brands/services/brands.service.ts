import { Injectable } from '@nestjs/common';
import { CreateBrandDto } from '../dtos/requests/create-brand.dto';
import { UpdateBrandDto } from '../dtos/requests/update-brand.dto';
import { GetAllResults } from 'src/common/api-features/types/pagination-results.types';
import { apiPaginationFeaturesDto } from '../../common/api-features/dtos/requests/api-pagination-features.dto';
import { StorageService } from 'src/common/storage/storage.service';
import { BrandRepository } from '../repositories/brand.repository';
import { BrandDtoMapper } from '../mappers/brand-dto.mapper';
import { BrandResponseDto } from '../dtos/responses/brand-response.dto';
import { QueryObjDtoMapper } from '../../common/api-features/mappers/query-dto.mapper';
import { BrandModel } from '../models/brand.model';

@Injectable()
export class BrandsService {
  constructor(
    private readonly storageService: StorageService,
    private readonly brandRepository: BrandRepository,
  ) {}

  async findAll(
    queryObjDto: apiPaginationFeaturesDto,
  ): Promise<GetAllResults<BrandResponseDto>> {
    // Map Query Obj from Dto to Model
    const QueryObjModel = QueryObjDtoMapper.dtoToModel(queryObjDto);
    // Use Repository To Get Data
    const { paginationResult, models } =
      await this.brandRepository.findAll(QueryObjModel);
    // Change Model to Response DTO
    const cleanedResult = {
      results: models.length,
      paginationResult,
      data: models.map((doc: BrandModel) =>
        BrandDtoMapper.modelToResponseDto(doc),
      ),
    };
    // Return Response
    return cleanedResult;
  }

  async findOneById(id: string): Promise<BrandResponseDto> {
    // Use Repository To Get Data
    const brand = await this.brandRepository.findOneById(id);
    // Change Model to Response DTO
    const responseDto = BrandDtoMapper.modelToResponseDto(brand);
    // Return Response
    return responseDto;
  }

  async create(createBrandDto: CreateBrandDto): Promise<BrandResponseDto> {
    // Map DTO to Model
    const model = BrandDtoMapper.dtoToModel(createBrandDto);
    // Use Repository to Create Record in DB
    const brand = await this.brandRepository.createOne(model);
    // Map Result to Response DTO
    const result = BrandDtoMapper.modelToResponseDto(brand);
    // Return Response
    return result;
  }

  async updateById(
    id: string,
    updateBrandDto: UpdateBrandDto,
  ): Promise<BrandResponseDto> {
    // Map DTO to Model
    const model = BrandDtoMapper.dtoToModel(updateBrandDto);
    // Use Repository to Update Record in DB
    const brand = await this.brandRepository.updateOneById(id, model);
    // Map Result to Response DTO
    const result = BrandDtoMapper.modelToResponseDto(brand);
    // Return Response
    return result;
  }

  async removeById(id: string): Promise<void> {
    // Use Repository To Delete Record
    await this.brandRepository.deleteById(id);
  }

  // Handling Brand Image Upload
  async uploadBrandImage(file: Express.Multer.File): Promise<string> {
    // Use Storage Service to Process and Store the Image
    const fileName = await this.storageService.processImage({
      file,
      dirName: 'brands',
      width: 600,
      height: 600,
      quality: 90,
    });

    // Return the Stored Image Filename or URL
    return fileName;
  }
}
