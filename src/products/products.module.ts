import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsController } from './controllers/products.controller';
import { ProductsService } from './services/products.service';
import { StorageService } from 'src/common/storage/storage.service';
import { ProductRepository } from './repositories/product.repository';
import { CategoriesModule } from 'src/categories/categories.module';
import { SubCategoriesModule } from 'src/sub-categories/sub-categories.module';
import { BrandsModule } from 'src/brands/brands.module';
import { Product, ProductSchema } from './schemas/product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    CategoriesModule,
    SubCategoriesModule,
    BrandsModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService, StorageService, ProductRepository],
  exports: [ProductRepository],
})
export class ProductsModule {}
