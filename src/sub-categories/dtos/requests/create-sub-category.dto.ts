import {
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  IsMongoId,
} from 'class-validator';

export class CreateSubCategoryDto {
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  @MinLength(3, { message: 'Name must be at least 3 characters long' })
  @MaxLength(32, { message: 'Name must be at most 32 characters long' })
  name: string;

  @IsNotEmpty({ message: 'Category is required' })
  @IsMongoId({ message: 'Category must be a valid MongoDB ObjectId' })
  category: string;
}
