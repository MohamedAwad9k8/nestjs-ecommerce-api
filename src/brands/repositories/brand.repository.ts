import { InjectModel } from '@nestjs/mongoose';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { HydratedDocument, Model } from 'mongoose';
import { Brand } from '../schemas/brand.schema';
import { BrandModel } from '../models/brand.model';
import { ApiFeatures } from 'src/common/api-features/api-features.service';
import { BrandRepositoryMapper } from '../mappers/brand-repository.mapper';
import { QueryObjModel } from '../../common/api-features/models/query.model';

export type BrandDocument = HydratedDocument<Brand>;

export class BrandRepository {
  constructor(
    @InjectModel(Brand.name) private readonly brandModel: Model<Brand>,
  ) {}

  // Mapping Functions

  // Mapping DB Document to Domain Model
  private mapToModel(doc: BrandDocument): BrandModel {
    return BrandRepositoryMapper.schemaToModel(doc);
  }
  // Mapping Domain Model to DB Document
  private mapToDocument(model: Partial<BrandModel>): Partial<Brand> {
    return BrandRepositoryMapper.modelToSchema(model);
  }

  // Helper Functions

  // Check if a Brand name exists
  async isBrandNameExists(name: string): Promise<boolean> {
    if (name === '') {
      return false;
    }
    const exists = await this.brandModel.exists({ name });
    return !!exists;
  }

  // Get total documents count
  async getTotalDocsCount() {
    const count = await this.brandModel.countDocuments();
    return count;
  }

  // DB Logic Functions

  // Get All Records With Pagination
  async findAll(queryObj: QueryObjModel) {
    // 1) Count total documents
    const documentsCount: number = await this.getTotalDocsCount();

    // 2) Build query with ApiFeatures
    const apiFeatures = new ApiFeatures<Brand>(this.brandModel.find(), queryObj)
      .paginate(documentsCount)
      .search(this.brandModel.modelName)
      .limitFields()
      .sort();

    const { mongooseQuery, paginationResult } = apiFeatures;

    // 3) Execute query
    const documents: BrandDocument[] = await mongooseQuery;

    // 4) Map all documents to domain models
    const models: BrandModel[] = documents.map((doc) => this.mapToModel(doc));

    // 5) Return structured results
    return {
      paginationResult,
      models,
    };
  }

  // Get Single Record By ID
  async findOneById(id: string): Promise<BrandModel> {
    const doc = await this.brandModel.findById(id);
    if (!doc) {
      throw new NotFoundException('Brand not found');
    }
    return this.mapToModel(doc);
  }

  // Create Single Record
  async createOne(model: BrandModel): Promise<BrandModel> {
    // 1) Ensure name doesn't exist
    if (await this.isBrandNameExists(model.name ?? '')) {
      throw new ConflictException('Brand with this name already exists');
    }

    // 2) Map model → document
    const docData = this.mapToDocument(model);

    // 3) Save to DB
    const createdDoc = await this.brandModel.create(docData);

    // 4) Map back to domain model
    return this.mapToModel(createdDoc);
  }

  // Update Single Record By ID
  async updateOneById(
    id: string,
    model: Partial<BrandModel>,
  ): Promise<BrandModel> {
    // 1) Check for name uniqueness
    if (model.name) {
      if (await this.isBrandNameExists(model.name ?? '')) {
        throw new ConflictException('Brand with this name already exists');
      }
    }

    // 2) Map model → document
    const updateData = this.mapToDocument(model);

    // 3) Update in DB
    const updatedDoc = await this.brandModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    // 4) If not found, throw error
    if (!updatedDoc) {
      throw new NotFoundException('Brand ID not found, failed to update');
    }

    // 5) Map to domain model and return
    return this.mapToModel(updatedDoc);
  }

  // Delete Single Record By ID
  async deleteById(id: string): Promise<void> {
    await this.brandModel.findByIdAndDelete(id);
  }
}
