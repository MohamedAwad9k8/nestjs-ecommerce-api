import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SubCategoriesController } from './controllers/sub-categories.controller';
import { SubCategoriesService } from './services/sub-categories.service';
import { SubCategoryRepository } from './repositories/sub-category.repository';
import { SubCategory, SubCategorySchema } from './schemas/sub-category.schema';
import { CategoriesModule } from 'src/categories/categories.module';
import { SubCategoryNestedRoutesController } from './controllers/sub-category-nested-routes.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SubCategory.name, schema: SubCategorySchema },
    ]),
    CategoriesModule,
  ],
  controllers: [SubCategoriesController, SubCategoryNestedRoutesController],
  providers: [SubCategoriesService, SubCategoryRepository],
})
export class SubCategoriesModule {}
