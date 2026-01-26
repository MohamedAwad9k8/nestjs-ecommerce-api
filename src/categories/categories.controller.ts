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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dtos/requests/create-category.dto';
import { UpdateCategoryDto } from './dtos/requests/update-category.dto';
import { Logger } from '@nestjs/common';
import { MongoIDValidationPipe } from '../common/pipes/mongo-id-validation.pipe';
import { CategoryResponseDto } from './dtos/responses/category-response.dto';
import { CategoryApiFeaturesDto } from './dtos/requests/category-api-features.dto';
import { GetAllDto } from './dtos/responses/get-all.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileValidationPipe } from 'src/common/storage/pipes/file-validation.pipe';
import { UploadFileTypesEnum } from 'src/common/storage/enums/valid-upload-extensions.enums';

@Controller('categories')
export class CategoriesController {
  private readonly logger = new Logger(CategoriesController.name);

  constructor(
    private categoriesService: CategoriesService,
    private readonly configService: ConfigService,
  ) {}

  @Get('')
  async findAll(@Query() queryObj: CategoryApiFeaturesDto): Promise<GetAllDto> {
    // Log Incoming Request
    this.logger.log('Fetching all categories');

    // Get results from service
    const result = await this.categoriesService.findAll(queryObj);

    // Return Response
    return result;
  }

  @Get(':id')
  async findOneById(
    @Param('id', MongoIDValidationPipe) id: string,
  ): Promise<CategoryResponseDto> {
    // Log Incoming Request
    this.logger.log(`Fetching category with ID: ${id}`);

    // Get result from service
    const category = await this.categoriesService.findOneById(id);

    // Return Response
    return category;
  }

  @Post('')
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
    @UploadedFile(
      new FileValidationPipe({
        required: true,
        maxSizeMB: 2,
        allowedTypes: [
          UploadFileTypesEnum.JPEG,
          UploadFileTypesEnum.PNG,
          UploadFileTypesEnum.WEBP,
        ],
      }),
    )
    image: Express.Multer.File,
  ): Promise<CategoryResponseDto> {
    // Log Incoming Request
    this.logger.log('Creating a new category');

    // Process uploaded image if exists
    if (image) {
      // Get photo url or path after uploading to storage (e.g., local, S3, etc.)
      const imageUrl = await this.categoriesService.uploadCategoryImage(image);

      // Attach imageUrl to createCategoryDto
      createCategoryDto.image = imageUrl;
    }

    // Get Result From Service
    const newCategory = await this.categoriesService.create(createCategoryDto);

    // Return Response
    return newCategory;
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('id', MongoIDValidationPipe) id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @UploadedFile(
      new FileValidationPipe({
        required: false,
        maxSizeMB: 2,
        allowedTypes: [
          UploadFileTypesEnum.JPEG,
          UploadFileTypesEnum.PNG,
          UploadFileTypesEnum.WEBP,
        ],
      }),
    )
    image: Express.Multer.File,
  ): Promise<CategoryResponseDto> {
    // Log Incoming Request
    this.logger.log(`Updating category with ID: ${id}`);

    // Process uploaded image if exists
    if (image) {
      // Get photo url or path after uploading to storage (e.g., local, S3, etc.)
      const imageUrl = await this.categoriesService.uploadCategoryImage(image);

      // Attach imageUrl to updateCategoryDto
      updateCategoryDto.image = imageUrl;
    }

    // Get Result From Service
    const updatedCategory = await this.categoriesService.updateById(
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
    await this.categoriesService.removeById(id);
  }
}
