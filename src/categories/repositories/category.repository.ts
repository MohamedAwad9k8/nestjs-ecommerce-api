import { InjectModel } from '@nestjs/mongoose';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { HydratedDocument, Model } from 'mongoose';
import { Category } from '../schemas/category.schema';
import { CategoryModel } from '../models/category.model';
import { ApiFeatures } from 'src/common/api-features/api-features.service';
import { CategoryRepositoryMapper } from '../mappers/category-repository.mapper';
import { QueryObjModel } from '../../common/api-features/models/query.model';

export type CategoryDocument = HydratedDocument<Category>;

export class CategoryRepository {
  constructor(
    @InjectModel(Category.name) private readonly categoryModel: Model<Category>,
  ) {}

  // Mapping Functions

  // Mapping DB Document to Domain Model
  private mapToModel(doc: CategoryDocument): CategoryModel {
    return CategoryRepositoryMapper.schemaToModel(doc);
  }
  // Mapping Domain Model to DB Document
  private mapToDocument(model: Partial<CategoryModel>): Partial<Category> {
    return CategoryRepositoryMapper.modelToSchema(model);
  }

  // Helper Functions

  // Check if a category name exists
  async isCategoryNameExists(name: string): Promise<boolean> {
    if (name === '') {
      return false;
    }
    const exists = await this.categoryModel.exists({ name });
    return !!exists;
  }
  // Check if a category ID exists
  async isCategoryIDExists(id: string): Promise<boolean> {
    if (id === '') {
      return false;
    }
    const exists = await this.categoryModel.exists({ _id: id });
    return !!exists;
  }
  // Get total documents count
  async getTotalDocsCount() {
    const count = await this.categoryModel.countDocuments();
    return count;
  }

  // DB Logic Functions

  // Get All Records With Pagination
  async findAll(queryObj: QueryObjModel) {
    // 1) Count total documents
    const documentsCount: number = await this.getTotalDocsCount();

    // 2) Build query with ApiFeatures
    const apiFeatures = new ApiFeatures<Category>(
      this.categoryModel.find(),
      queryObj,
    )
      .paginate(documentsCount)
      .search(this.categoryModel.modelName)
      .limitFields()
      .sort();

    const { mongooseQuery, paginationResult } = apiFeatures;

    // 3) Execute query
    const documents: CategoryDocument[] = await mongooseQuery;

    // 4) Map all documents to domain models
    const models: CategoryModel[] = documents.map((doc) =>
      this.mapToModel(doc),
    );

    // 5) Return structured results
    return {
      paginationResult,
      models,
    };
  }

  // Get Single Record By ID
  async findOneById(id: string): Promise<CategoryModel> {
    const doc = await this.categoryModel.findById(id);
    if (!doc) {
      throw new NotFoundException('Category not found');
    }
    return this.mapToModel(doc);
  }

  // Create Single Record
  async createOne(model: CategoryModel): Promise<CategoryModel> {
    // 1) Ensure name doesn't exist
    if (await this.isCategoryNameExists(model.name ?? '')) {
      throw new ConflictException('Category with this name already exists');
    }

    // 2) Map model → document
    const docData = this.mapToDocument(model);

    // 3) Save to DB
    const createdDoc = await this.categoryModel.create(docData);

    // 4) Map back to domain model
    return this.mapToModel(createdDoc);
  }

  // Update Single Record By ID
  async updateOneById(
    id: string,
    model: Partial<CategoryModel>,
  ): Promise<CategoryModel> {
    // 1) Check for name uniqueness
    if (model.name) {
      if (await this.isCategoryNameExists(model.name ?? '')) {
        throw new ConflictException('Category with this name already exists');
      }
    }

    // 2) Map model → document
    const updateData = this.mapToDocument(model);

    // 3) Update in DB
    const updatedDoc = await this.categoryModel.findByIdAndUpdate(
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
    await this.categoryModel.findByIdAndDelete(id);
  }
}
