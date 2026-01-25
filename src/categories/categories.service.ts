import slugify from 'slugify';
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './schemas/category.schema';
import { CreateCategoryDto } from './dtos/requests/create-category.dto';
import { UpdateCategoryDto } from './dtos/requests/update-category.dto';
import { ApiFeatures } from 'src/common/api-features/api-features.service';
import { GetAllResults } from 'src/common/api-features/api-features.types';
import { CategoryApiFeaturesDto } from './dtos/requests/category-api-features.dto';
import { StorageService } from 'src/common/storage/storage.service';

@Injectable()
export class CategoriesService {
  constructor(
    private readonly storageService: StorageService,
    @InjectModel(Category.name)
    private categoryModel: Model<Category>,
  ) {}

  async findAll(
    queryObj: CategoryApiFeaturesDto,
  ): Promise<GetAllResults<Category>> {
    // Build Query
    const documentsCount = await this.categoryModel.countDocuments();
    const apiFeatures = new ApiFeatures<Category>(
      this.categoryModel.find(),
      queryObj,
    )
      .paginate(documentsCount)
      .search(this.categoryModel.modelName)
      .limitFields()
      .sort();

    // Execute Query
    const { mongooseQuery, paginationResult } = apiFeatures;
    const documents: Category[] = (await mongooseQuery).map((doc) =>
      doc.toObject(),
    );
    return {
      results: documents.length,
      paginationResult,
      data: documents,
    };
  }

  async findOneById(id: string): Promise<Category> {
    // 1) Find the Category by ID
    const document = (await this.categoryModel.findById(id))?.toObject();
    // 2) If Not Found, Throw Error
    if (!document) {
      throw new NotFoundException('Category not found');
    }
    // 3) Return the Found Category
    return document;
  }

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    // 1) Change DTO to Entity
    const newCategory = this.dtoToEntity(createCategoryDto);

    // 2) Make Sure Name doesn't Exist in the Database
    if (await this.isCategoryNameExists(newCategory.name ?? null)) {
      throw new ConflictException('Category with this name already exists');
    }

    // 3) Create the Category
    const createdCategory = (
      await this.categoryModel.create(newCategory)
    ).toObject();

    // 4) Return the Created Category
    return createdCategory;
  }

  async updateById(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    // 1) Change DTO to Entity
    const updatedCategory: Partial<Category> =
      this.dtoToEntity(updateCategoryDto);

    // 2) Make Sure Name doesn't Exist in the Database
    if (await this.isCategoryNameExists(updatedCategory.name ?? null)) {
      throw new ConflictException('Category with this name already exists');
    }

    // 3) Update the Category
    const updatedCategoryDoc = (
      await this.categoryModel.findByIdAndUpdate(id, updatedCategory, {
        new: true,
      })
    )?.toObject();

    // 4) If Not Found, Throw Error
    if (!updatedCategoryDoc) {
      throw new NotFoundException('Category not found');
    }
    // 5) Return the Updated Category
    return updatedCategoryDoc;
  }

  async removeById(id: string): Promise<void> {
    // Delete the Category by ID
    await this.categoryModel.findByIdAndDelete(id);
  }

  async uploadCategoryImage(file: Express.Multer.File): Promise<string> {
    // Use Storage Service to Process and Store the Image
    const fileName = await this.storageService.processImage({
      file,
      dirName: 'categories',
      width: 600,
      height: 600,
      quality: 90,
    });

    // Return the Stored Image Filename or URL
    return fileName;
  }

  //Helper Method To Convert DTO to Entity
  dtoToEntity(dto: CreateCategoryDto | UpdateCategoryDto): Partial<Category> {
    const result: Partial<Category> = { ...dto };

    if (dto.name) {
      result.slug = slugify(dto.name, { lower: true });
    }

    return result;
  }

  //Helper Method To Check Existing Category By Name
  async isCategoryNameExists(name: string | null): Promise<boolean> {
    if (!name) {
      return false;
    }
    const existingCategory = await this.categoryModel.findOne({ name });
    return !!existingCategory;
  }
}
