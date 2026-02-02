import { Controller, Get, Post, Param, Body, Query } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { SubCategoriesService } from '../services/sub-categories.service';
import { NestedRouteDto } from '../dtos/requests/sub-category-nested-routes.dto';
import { apiPaginationFeaturesDto } from '../../common/api-features/dtos/requests/api-pagination-features.dto';
import { MongoIDValidationPipe } from '../../common/pipes/mongo-id-validation.pipe';

@Controller('categories/:categoryId/subcategories') // nested routes
export class SubCategoryNestedRoutesController {
  private readonly logger = new Logger(SubCategoryNestedRoutesController.name);
  constructor(private readonly subCategoriesService: SubCategoriesService) {}

  // GET /categories/:categoryId/subcategories
  @Get()
  async findAllByCategory(
    @Query() queryObj: apiPaginationFeaturesDto,
    @Param('categoryId', MongoIDValidationPipe) categoryId: string,
  ) {
    // Log Incoming Request
    this.logger.log(
      `Fetching all subCategories for category ID: ${categoryId}`,
    );

    // Get results from service
    const result = await this.subCategoriesService.findAll(
      queryObj,
      categoryId,
    );

    // Return Response
    return result;
  }

  // POST /categories/:categoryId/subcategories
  @Post()
  async createForCategory(
    @Param('categoryId', MongoIDValidationPipe) categoryId: string,
    @Body() dto: NestedRouteDto,
  ) {
    // Log Incoming Request
    this.logger.log(`Creating subCategory for category ID: ${categoryId}`);

    // override DTO category to match route param
    dto.category = categoryId;

    // Get Result From Service
    const newCategory = await this.subCategoriesService.create(dto);

    // Return Response
    return newCategory;
  }
}
