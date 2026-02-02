import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { MongodbModule } from './mongodb/mongodb.module';
import { CategoriesModule } from './categories/categories.module';
import { SubCategoriesModule } from './sub-categories/sub-categories.module';
import { BrandsModule } from './brands/brands.module';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'), // folder to serve
      serveRoot: '/uploads', // URL prefix
    }),
    ConfigModule.forRoot({ isGlobal: true, expandVariables: true }),
    MongodbModule,
    CategoriesModule,
    SubCategoriesModule,
    BrandsModule,
    ProductsModule,
  ],
  controllers: [],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: ClassSerializerInterceptor },
  ],
})
export class AppModule {}
