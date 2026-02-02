import {
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  IsMongoId,
  IsOptional,
  IsArray,
  IsNumber,
  Min,
  Max,
} from 'class-validator';

export class CreateProductDto {
  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty({ message: 'Title is required' })
  @MinLength(3, { message: 'Title must be at least 3 characters long' })
  @MaxLength(100, { message: 'Title must be at most 100 characters long' })
  title: string;

  @IsString({ message: 'Description must be a string' })
  @IsNotEmpty({ message: 'Description is required' })
  @MinLength(20, { message: 'Description must be at least 20 characters long' })
  @MaxLength(500, {
    message: 'Description must be at most 500 characters long',
  })
  description: string;

  @IsNumber()
  @IsNotEmpty({ message: 'Quantity is required' })
  quantity: number;

  @IsOptional()
  @IsNumber()
  sold?: number;

  @IsNumber()
  @IsNotEmpty({ message: 'Price is required' })
  @Min(0, { message: 'Price must be a positive number' })
  @Max(500000, { message: 'Price must not exceed 500,000' })
  price: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true, message: 'Each color must be a string' })
  colors: string[];

  @IsOptional()
  @IsString({ message: 'Image cover must be a string' })
  imageCover?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true, message: 'Each image must be a string' })
  images: string[];

  @IsNotEmpty({ message: 'Category is required' })
  @IsMongoId({ message: 'Category must be a valid MongoDB ObjectId' })
  category: string;

  @IsOptional()
  @IsArray()
  @IsMongoId({
    each: true,
    message: 'subCategories must be valid MongoDB ObjectIds',
  })
  subCategories: string[];

  @IsOptional()
  @IsMongoId({ message: 'Brand must be a valid MongoDB ObjectId' })
  brand: string;
}
