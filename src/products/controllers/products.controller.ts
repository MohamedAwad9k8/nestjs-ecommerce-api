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
  UploadedFiles,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { ProductsService } from '../services/products.service';
import { CreateProductDto } from '../dtos/requests/create-product.dto';
import { UpdateProductDto } from '../dtos/requests/update-product.dto';
import { MongoIDValidationPipe } from '../../common/pipes/mongo-id-validation.pipe';
import { ProductResponseDto } from '../dtos/responses/product-response.dto';
import { apiPaginationFeaturesDto } from '../../common/api-features/dtos/requests/api-pagination-features.dto';
import { GetAllDto } from '../../common/api-features/dtos/responses/get-all.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { FileValidationPipe } from 'src/common/storage/pipes/file-validation.pipe';
import { UploadFileTypesEnum } from 'src/common/storage/enums/valid-upload-extensions.enums';

@Controller('products')
export class ProductsController {
  private readonly logger = new Logger(ProductsController.name);

  constructor(
    private productsService: ProductsService,
    private readonly configService: ConfigService,
  ) {}

  @Get('')
  async findAll(
    @Query() queryObj: apiPaginationFeaturesDto,
  ): Promise<GetAllDto<ProductResponseDto>> {
    // Log Incoming Request
    this.logger.log('Fetching all brands');

    // Get results from service
    const result = await this.productsService.findAll(queryObj);

    // Return Response
    return result;
  }

  @Get(':id')
  async findOneById(
    @Param('id', MongoIDValidationPipe) id: string,
  ): Promise<ProductResponseDto> {
    // Log Incoming Request
    this.logger.log(`Fetching brand with ID: ${id}`);

    // Get result from service
    const brand = await this.productsService.findOneById(id);

    // Return Response
    return brand;
  }

  @Post('')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'imageCover', maxCount: 1 },
      { name: 'images', maxCount: 5 },
    ]),
  )
  async create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles(
      new FileValidationPipe({
        required: false, // allow no file
        maxSizeMB: 2,
        allowedTypes: [
          UploadFileTypesEnum.JPEG,
          UploadFileTypesEnum.PNG,
          UploadFileTypesEnum.WEBP,
        ],
      }),
    )
    files: {
      imageCover?: Express.Multer.File[];
      images?: Express.Multer.File[];
    },
  ): Promise<ProductResponseDto> {
    // Log Incoming Request
    this.logger.log('Creating a new brand');

    // Single cover image
    if (files.imageCover?.length) {
      createProductDto.imageCover =
        await this.productsService.uploadProductImages(files.imageCover[0]);
    }

    // Multiple images
    if (files.images?.length) {
      createProductDto.images =
        await this.productsService.uploadProductImagesMultiple(files.images);
    }

    // Get Result From Service
    const newProduct = await this.productsService.create(createProductDto);

    // Return Response
    return newProduct;
  }

  @Put(':id')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'imageCover', maxCount: 1 },
      { name: 'images', maxCount: 5 },
    ]),
  )
  async update(
    @Param('id', MongoIDValidationPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFiles(
      new FileValidationPipe({
        required: false, // allow no file
        maxSizeMB: 2,
        allowedTypes: [
          UploadFileTypesEnum.JPEG,
          UploadFileTypesEnum.PNG,
          UploadFileTypesEnum.WEBP,
        ],
      }),
    )
    files: {
      imageCover?: Express.Multer.File[];
      images?: Express.Multer.File[];
    },
  ): Promise<ProductResponseDto> {
    // Log Incoming Request
    this.logger.log(`Updating brand with ID: ${id}`);

    // Single cover image
    if (files.imageCover?.length) {
      updateProductDto.imageCover =
        await this.productsService.uploadProductImages(files.imageCover[0]);
    }

    // Multiple images
    if (files.images?.length) {
      updateProductDto.images =
        await this.productsService.uploadProductImagesMultiple(files.images);
    }

    // Get Result From Service
    const updatedProduct = await this.productsService.updateById(
      id,
      updateProductDto,
    );

    // Return Response
    return updatedProduct;
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', MongoIDValidationPipe) id: string): Promise<void> {
    // Log Incoming Request
    this.logger.log(`Deleting brand with ID: ${id}`);

    // Service Deletes Record
    await this.productsService.removeById(id);
  }
}
