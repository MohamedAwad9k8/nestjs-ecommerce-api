import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BrandsController } from './controllers/brands.controller';
import { BrandsService } from './services/brands.service';
import { BrandRepository } from './repositories/brand.repository';
import { StorageService } from 'src/common/storage/storage.service';
import { Brand, BrandSchema } from './schemas/brand.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Brand.name, schema: BrandSchema }]),
  ],
  controllers: [BrandsController],
  providers: [BrandsService, BrandRepository, StorageService],
  exports: [BrandRepository],
})
export class BrandsModule {}
