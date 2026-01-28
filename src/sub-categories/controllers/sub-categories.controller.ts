import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpCode,
  Query,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SubCategoriesService } from '../services/sub-categories.service';
import { CreateSubCategoryDto } from '../dtos/requests/create-sub-category.dto';
import { UpdateSubCategoryDto } from '../dtos/requests/update-sub-category.dto';
import { Logger } from '@nestjs/common';
import { MongoIDValidationPipe } from '../../common/pipes/mongo-id-validation.pipe';
import { SubCategoryResponseDto } from '../dtos/responses/sub-category-response.dto';
import { apiPaginationFeaturesDto } from '../../common/api-features/dtos/requests/api-pagination-features.dto';
import { GetAllDto } from '../../common/api-features/dtos/responses/get-all.dto';

@Controller('subcategories')
export class SubCategoriesController {
  private readonly logger = new Logger(SubCategoriesController.name);

  constructor(
    private subCategoriesService: SubCategoriesService,
    private readonly configService: ConfigService,
  ) {}

  @Get('')
  async findAll(
    @Query() queryObj: apiPaginationFeaturesDto,
  ): Promise<GetAllDto<SubCategoryResponseDto>> {
    // Log Incoming Request
    this.logger.log('Fetching all subCategories');

    // Get results from service
    const result = await this.subCategoriesService.findAll(queryObj);

    // Return Response
    return result;
  }

  @Get(':id')
  async findOneById(
    @Param('id', MongoIDValidationPipe) id: string,
  ): Promise<SubCategoryResponseDto> {
    // Log Incoming Request
    this.logger.log(`Fetching subCategory with ID: ${id}`);

    // Get result from service
    const category = await this.subCategoriesService.findOneById(id);

    // Return Response
    return category;
  }

  @Post('')
  async create(
    @Body() createCategoryDto: CreateSubCategoryDto,
  ): Promise<SubCategoryResponseDto> {
    // Log Incoming Request
    this.logger.log('Creating a new subCategory');

    // Get Result From Service
    const newCategory =
      await this.subCategoriesService.create(createCategoryDto);

    // Return Response
    return newCategory;
  }

  @Put(':id')
  async update(
    @Param('id', MongoIDValidationPipe) id: string,
    @Body() updateCategoryDto: UpdateSubCategoryDto,
  ): Promise<SubCategoryResponseDto> {
    // Log Incoming Request
    this.logger.log(`Updating category with ID: ${id}`);

    // Get Result From Service
    const updatedCategory = await this.subCategoriesService.updateById(
      id,
      updateCategoryDto,
    );

    // Return Response
    return updatedCategory;
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', MongoIDValidationPipe) id: string): Promise<void> {
    // Log Incoming Request
    this.logger.log(`Deleting category with ID: ${id}`);

    // Service Deletes Record
    await this.subCategoriesService.removeById(id);
  }
}
