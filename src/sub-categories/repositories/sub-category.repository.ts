import { InjectModel } from '@nestjs/mongoose';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { HydratedDocument, Model, Types } from 'mongoose';
import { SubCategory } from '../schemas/sub-category.schema';
import { SubCategoryModel } from '../models/sub-category.model';
import { ApiFeatures } from 'src/common/api-features/api-features.service';
import { SubCategoryRepositoryMapper } from '../mappers/sub-category-repository.mapper';
import { QueryObjModel } from '../../common/api-features/models/query.model';

export type SubCategoryDocument = HydratedDocument<SubCategory>;

export class SubCategoryRepository {
  constructor(
    @InjectModel(SubCategory.name)
    private readonly subCategoryModel: Model<SubCategory>,
  ) {}

  // Mapping Functions

  // Mapping DB Document to Domain Model
  private mapToModel(doc: SubCategoryDocument): SubCategoryModel {
    return SubCategoryRepositoryMapper.schemaToModel(doc);
  }
  // Mapping Domain Model to DB Document
  private mapToDocument(
    model: Partial<SubCategoryModel>,
  ): Partial<SubCategory> {
    return SubCategoryRepositoryMapper.modelToSchema(model);
  }

  // Helper Functions

  // Check if a sub-category name exists
  async isSubCategoryNameExists(name: string): Promise<boolean> {
    if (name === '') {
      return false;
    }
    const exists = await this.subCategoryModel.exists({ name });
    return !!exists;
  }
  // Get total documents count
  async getTotalDocsCount() {
    const count = await this.subCategoryModel.countDocuments();
    return count;
  }

  // DB Logic Functions

  // Get All Records With Pagination
  async findAll(queryObj: QueryObjModel, categoryFilter?: string) {
    // 1) Build base query
    let baseQuery = this.subCategoryModel.find();

    // 2) Apply category filter if provided
    if (categoryFilter) {
      baseQuery = baseQuery
        .where('category')
        .equals(new Types.ObjectId(categoryFilter));
    }

    // 3) Count total documents for pagination
    const documentsCount: number = await baseQuery.clone().countDocuments();

    // 4) Build query with ApiFeatures
    const apiFeatures = new ApiFeatures<SubCategory>(baseQuery, queryObj)
      .paginate(documentsCount)
      .search(this.subCategoryModel.modelName)
      .limitFields()
      .sort();

    const { mongooseQuery, paginationResult } = apiFeatures;

    // 3) Execute query
    const documents: SubCategoryDocument[] = await mongooseQuery;

    // 4) Map all documents to domain models
    const models: SubCategoryModel[] = documents.map((doc) =>
      this.mapToModel(doc),
    );

    // 5) Return structured results
    return {
      paginationResult,
      models,
    };
  }

  // Get Single Record By ID
  async findOneById(id: string): Promise<SubCategoryModel> {
    const doc = await this.subCategoryModel.findById(id);
    if (!doc) {
      throw new NotFoundException('SubCategory not found');
    }
    return this.mapToModel(doc);
  }

  // Create Single Record
  async createOne(model: SubCategoryModel): Promise<SubCategoryModel> {
    // 1) Ensure name doesn't exist
    if (await this.isSubCategoryNameExists(model.name ?? '')) {
      throw new ConflictException('SubCategory with this name already exists');
    }

    // 2) Map model → document
    const docData = this.mapToDocument(model);

    // 3) Save to DB
    const createdDoc = await this.subCategoryModel.create(docData);

    // 4) Map back to domain model
    return this.mapToModel(createdDoc);
  }

  // Update Single Record By ID
  async updateOneById(
    id: string,
    model: Partial<SubCategoryModel>,
  ): Promise<SubCategoryModel> {
    // 1) Check for name uniqueness
    if (model.name) {
      if (await this.isSubCategoryNameExists(model.name ?? '')) {
        throw new ConflictException(
          'SubCategory with this name already exists',
        );
      }
    }

    // 2) Map model → document
    const updateData = this.mapToDocument(model);

    // 3) Update in DB
    const updatedDoc = await this.subCategoryModel.findByIdAndUpdate(
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
    await this.subCategoryModel.findByIdAndDelete(id);
  }
}
