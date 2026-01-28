import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from '../dtos/requests/create-product.dto';
import { UpdateProductDto } from '../dtos/requests/update-product.dto';
import { GetAllResults } from 'src/common/api-features/types/pagination-results.types';
import { apiPaginationFeaturesDto } from '../../common/api-features/dtos/requests/api-pagination-features.dto';
import { StorageService } from 'src/common/storage/storage.service';

import { ProductDtoMapper } from '../mappers/product-dto.mapper';
import { ProductResponseDto } from '../dtos/responses/product-response.dto';
import { QueryObjDtoMapper } from '../../common/api-features/mappers/query-dto.mapper';
import { ProductModel } from '../models/product.model';
import { EmbeddedEntityModel } from '../models/embedded-entity.model';
import { ProductRepository } from '../repositories/product.repository';
import { CategoryRepository } from 'src/categories/repositories/category.repository';
import { SubCategoryRepository } from 'src/sub-categories/repositories/sub-category.repository';
import { BrandRepository } from 'src/brands/repositories/brand.repository';

@Injectable()
export class ProductsService {
  constructor(
    private readonly storageService: StorageService,
    private readonly productRepository: ProductRepository,
    private readonly categoryRepository: CategoryRepository,
    private readonly subCategoryRepository: SubCategoryRepository,
    private readonly brandRepository: BrandRepository,
  ) {}

  async findAll(
    queryObjDto: apiPaginationFeaturesDto,
  ): Promise<GetAllResults<ProductResponseDto>> {
    // Map Query Obj from Dto to Model
    const QueryObjModel = QueryObjDtoMapper.dtoToModel(queryObjDto);
    // Use Repository To Get Data
    const { paginationResult, models } =
      await this.productRepository.findAll(QueryObjModel);
    // Change Model to Response DTO
    const cleanedResult = {
      results: models.length,
      paginationResult,
      data: models.map((doc: ProductModel) =>
        ProductDtoMapper.modelToResponseDto(doc),
      ),
    };
    // Return Response
    return cleanedResult;
  }

  async findOneById(id: string): Promise<ProductResponseDto> {
    // Use Repository To Get Data
    const product = await this.productRepository.findOneById(id);
    // Change Model to Response DTO
    const responseDto = ProductDtoMapper.modelToResponseDto(product);
    // Return Response
    return responseDto;
  }

  async create(
    createCategoryDto: CreateProductDto,
  ): Promise<ProductResponseDto> {
    // Map DTO to Model
    const model = ProductDtoMapper.dtoToModel(createCategoryDto);
    // Use Repository to Create Record in DB
    const product = await this.productRepository.createOne(model);
    // Map Result to Response DTO
    const result = ProductDtoMapper.modelToResponseDto(product);
    // Return Response
    return result;
  }

  async updateById(
    id: string,
    updateCategoryDto: UpdateProductDto,
  ): Promise<ProductResponseDto> {
    // Map DTO to Model
    const model = ProductDtoMapper.dtoToModel(updateCategoryDto);
    // Use Repository to Update Record in DB
    const product = await this.productRepository.updateOneById(id, model);
    // Map Result to Response DTO
    const result = ProductDtoMapper.modelToResponseDto(product);
    // Return Response
    return result;
  }

  async removeById(id: string): Promise<void> {
    // Use Repository To Delete Record
    await this.productRepository.deleteById(id);
  }

  // Validate And Enrich Category Embedded Entity
  async validateAndEnrichCategory(model: ProductModel): Promise<void> {
    if (model.category) {
      const category = await this.categoryRepository.findOneById(
        model.category.id!,
      );
      if (!category) {
        throw new NotFoundException('Category not found');
      }
      model.category = new EmbeddedEntityModel({
        id: category.id,
        name: category.name,
        slug: category.slug,
      });
    }
  }

  // Validate And Enrich SubCategories Embedded Entities
  async validateAndEnrichSubCategories(model: ProductModel): Promise<void> {
    if (model.subCategories && model.subCategories.length > 0) {
      const enrichedSubCategories: EmbeddedEntityModel[] = [];
      for (const subCat of model.subCategories) {
        const subCategory = await this.subCategoryRepository.findOneById(
          subCat.id!,
        );
        if (!subCategory) {
          throw new NotFoundException(
            `SubCategory with ID ${subCat.id} not found`,
          );
        }
        enrichedSubCategories.push(
          new EmbeddedEntityModel({
            id: subCategory.id,
            name: subCategory.name,
            slug: subCategory.slug,
          }),
        );
      }
      model.subCategories = enrichedSubCategories;
    }
  }

  // Validate And Enrich Brand Embedded Entity
  async validateAndEnrichBrand(model: ProductModel): Promise<void> {
    if (model.brand) {
      const brand = await this.brandRepository.findOneById(model.brand.id!);
      if (!brand) {
        throw new NotFoundException('Brand not found');
      }
      model.brand = new EmbeddedEntityModel({
        id: brand.id,
        name: brand.name,
        slug: brand.slug,
      });
    }
  }

  // Handling Category Image Upload
  async uploadCategoryImage(file: Express.Multer.File): Promise<string> {
    // Use Storage Service to Process and Store the Image
    const fileName = await this.storageService.processImage({
      file,
      dirName: 'products',
      width: 600,
      height: 600,
      quality: 90,
    });

    // Return the Stored Image Filename or URL
    return fileName;
  }
}
