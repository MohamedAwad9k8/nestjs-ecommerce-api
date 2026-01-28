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
import { Logger } from '@nestjs/common';
import { ProductsService } from '../services/products.service';
import { CreateProductDto } from '../dtos/requests/create-product.dto';
import { UpdateProductDto } from '../dtos/requests/update-product.dto';
import { MongoIDValidationPipe } from '../../common/pipes/mongo-id-validation.pipe';
import { ProductResponseDto } from '../dtos/responses/product-response.dto';
import { apiPaginationFeaturesDto } from '../../common/api-features/dtos/requests/api-pagination-features.dto';
import { GetAllDto } from '../../common/api-features/dtos/responses/get-all.dto';
import { FileInterceptor } from '@nestjs/platform-express';
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
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() createProductDto: CreateProductDto,
    // @UploadedFile(
    //   new FileValidationPipe({
    //     required: true,
    //     maxSizeMB: 2,
    //     allowedTypes: [
    //       UploadFileTypesEnum.JPEG,
    //       UploadFileTypesEnum.PNG,
    //       UploadFileTypesEnum.WEBP,
    //     ],
    //   }),
    // )
    // image: Express.Multer.File,
  ): Promise<ProductResponseDto> {
    // Log Incoming Request
    this.logger.log('Creating a new brand');

    // Process uploaded image if exists
    // if (image) {
    //   // Get photo url or path after uploading to storage (e.g., local, S3, etc.)
    //   const imageUrl = await this.productsService.uploadBrandImage(image);

    //   // Attach imageUrl to createProductDto
    //   createProductDto.imageCover = imageUrl;
    // }

    // Get Result From Service
    const newProduct = await this.productsService.create(createProductDto);

    // Return Response
    return newProduct;
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('id', MongoIDValidationPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
    // @UploadedFile(
    //   new FileValidationPipe({
    //     required: false,
    //     maxSizeMB: 2,
    //     allowedTypes: [
    //       UploadFileTypesEnum.JPEG,
    //       UploadFileTypesEnum.PNG,
    //       UploadFileTypesEnum.WEBP,
    //     ],
    //   }),
    // )
    // image: Express.Multer.File,
  ): Promise<ProductResponseDto> {
    // Log Incoming Request
    this.logger.log(`Updating brand with ID: ${id}`);

    // Process uploaded image if exists
    // if (image) {
    //   // Get photo url or path after uploading to storage (e.g., local, S3, etc.)
    //   const imageUrl = await this.productsService.uploadBrandImage(image);

    //   // Attach imageUrl to updateBrandDto
    //   updateBrandDto.image = imageUrl;
    // }

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
