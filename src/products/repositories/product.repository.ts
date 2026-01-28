import { InjectModel } from '@nestjs/mongoose';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { HydratedDocument, Model } from 'mongoose';
import { Product } from '../schemas/product.schema';
import { ProductModel } from '../models/product.model';
import { ApiFeatures } from 'src/common/api-features/api-features.service';
import { ProductRepositoryMapper } from '../mappers/product-repository.mapper';
import { QueryObjModel } from '../../common/api-features/models/query.model';

export type ProductDocument = HydratedDocument<Product>;

export class ProductRepository {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<Product>,
  ) {}

  // Mapping Functions

  // Mapping DB Document to Domain Model
  private mapToModel(doc: ProductDocument): ProductModel {
    return ProductRepositoryMapper.schemaToModel(doc);
  }
  // Mapping Domain Model to DB Document
  private mapToDocument(model: Partial<ProductModel>): Partial<Product> {
    return ProductRepositoryMapper.modelToSchema(model);
  }

  // Helper Functions

  // Check if a product title exists
  async isProductTitleExists(title: string): Promise<boolean> {
    if (title === '') {
      return false;
    }
    const exists = await this.productModel.exists({ title });
    return !!exists;
  }
  // Get total documents count
  async getTotalDocsCount() {
    const count = await this.productModel.countDocuments();
    return count;
  }

  // DB Logic Functions

  // Get All Records With Pagination
  async findAll(queryObj: QueryObjModel) {
    // 1) Count total documents
    const documentsCount: number = await this.getTotalDocsCount();

    // 2) Build query with ApiFeatures
    const apiFeatures = new ApiFeatures<Product>(
      this.productModel.find(),
      queryObj,
    )
      .paginate(documentsCount)
      .search(this.productModel.modelName)
      .limitFields()
      .sort();

    const { mongooseQuery, paginationResult } = apiFeatures;

    // 3) Execute query
    const documents: ProductDocument[] = await mongooseQuery;

    // 4) Map all documents to domain models
    const models: ProductModel[] = documents.map((doc) => this.mapToModel(doc));

    // 5) Return structured results
    return {
      paginationResult,
      models,
    };
  }

  // Get Single Record By ID
  async findOneById(id: string): Promise<ProductModel> {
    const doc = await this.productModel.findById(id);
    if (!doc) {
      throw new NotFoundException('Product not found');
    }
    return this.mapToModel(doc);
  }

  // Create Single Record
  async createOne(model: ProductModel): Promise<ProductModel> {
    // 1) Ensure name doesn't exist
    if (await this.isProductTitleExists(model.title ?? '')) {
      throw new ConflictException('Product with this title already exists');
    }

    // 2) Map model → document
    const docData = this.mapToDocument(model);

    // 3) Save to DB
    const createdDoc = await this.productModel.create(docData);

    // 4) Map back to domain model
    return this.mapToModel(createdDoc);
  }

  // Update Single Record By ID
  async updateOneById(
    id: string,
    model: Partial<ProductModel>,
  ): Promise<ProductModel> {
    // 1) Check for title uniqueness
    if (model.title) {
      if (await this.isProductTitleExists(model.title ?? '')) {
        throw new ConflictException('Product with this title already exists');
      }
    }

    // 2) Map model → document
    const updateData = this.mapToDocument(model);

    // 3) Update in DB
    const updatedDoc = await this.productModel.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
      },
    );

    // 4) If not found, throw error
    if (!updatedDoc) {
      throw new NotFoundException('Category ID not found, failed to update');
    }

    // 5) Map to domain model and return
    return this.mapToModel(updatedDoc);
  }

  // Delete Single Record By ID
  async deleteById(id: string): Promise<void> {
    await this.productModel.findByIdAndDelete(id);
  }
}
