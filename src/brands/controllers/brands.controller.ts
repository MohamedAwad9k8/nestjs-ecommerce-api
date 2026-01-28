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
import { BrandsService } from '../services/brands.service';
import { CreateBrandDto } from '../dtos/requests/create-brand.dto';
import { UpdateBrandDto } from '../dtos/requests/update-brand.dto';
import { Logger } from '@nestjs/common';
import { MongoIDValidationPipe } from '../../common/pipes/mongo-id-validation.pipe';
import { BrandResponseDto } from '../dtos/responses/brand-response.dto';
import { apiPaginationFeaturesDto } from '../../common/api-features/dtos/requests/api-pagination-features.dto';
import { GetAllDto } from '../../common/api-features/dtos/responses/get-all.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileValidationPipe } from 'src/common/storage/pipes/file-validation.pipe';
import { UploadFileTypesEnum } from 'src/common/storage/enums/valid-upload-extensions.enums';

@Controller('brands')
export class BrandsController {
  private readonly logger = new Logger(BrandsController.name);

  constructor(
    private brandsService: BrandsService,
    private readonly configService: ConfigService,
  ) {}

  @Get('')
  async findAll(
    @Query() queryObj: apiPaginationFeaturesDto,
  ): Promise<GetAllDto<BrandResponseDto>> {
    // Log Incoming Request
    this.logger.log('Fetching all brands');

    // Get results from service
    const result = await this.brandsService.findAll(queryObj);

    // Return Response
    return result;
  }

  @Get(':id')
  async findOneById(
    @Param('id', MongoIDValidationPipe) id: string,
  ): Promise<BrandResponseDto> {
    // Log Incoming Request
    this.logger.log(`Fetching brand with ID: ${id}`);

    // Get result from service
    const brand = await this.brandsService.findOneById(id);

    // Return Response
    return brand;
  }

  @Post('')
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() createBrandyDto: CreateBrandDto,
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
  ): Promise<BrandResponseDto> {
    // Log Incoming Request
    this.logger.log('Creating a new brand');

    // Process uploaded image if exists
    if (image) {
      // Get photo url or path after uploading to storage (e.g., local, S3, etc.)
      const imageUrl = await this.brandsService.uploadBrandImage(image);

      // Attach imageUrl to createBrandyDto
      createBrandyDto.image = imageUrl;
    }

    // Get Result From Service
    const newCategory = await this.brandsService.create(createBrandyDto);

    // Return Response
    return newCategory;
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('id', MongoIDValidationPipe) id: string,
    @Body() updateBrandDto: UpdateBrandDto,
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
  ): Promise<BrandResponseDto> {
    // Log Incoming Request
    this.logger.log(`Updating brand with ID: ${id}`);

    // Process uploaded image if exists
    if (image) {
      // Get photo url or path after uploading to storage (e.g., local, S3, etc.)
      const imageUrl = await this.brandsService.uploadBrandImage(image);

      // Attach imageUrl to updateBrandDto
      updateBrandDto.image = imageUrl;
    }

    // Get Result From Service
    const updatedBrand = await this.brandsService.updateById(
      id,
      updateBrandDto,
    );

    // Return Response
    return updatedBrand;
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', MongoIDValidationPipe) id: string): Promise<void> {
    // Log Incoming Request
    this.logger.log(`Deleting brand with ID: ${id}`);

    // Service Deletes Record
    await this.brandsService.removeById(id);
  }
}
