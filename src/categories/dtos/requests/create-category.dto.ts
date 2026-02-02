import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateCategoryDto {
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  @MinLength(3, { message: 'Name must be at least 3 characters long' })
  @MaxLength(32, { message: 'Name must be at most 32 characters long' })
  name: string;

  @IsOptional()
  @IsString({ message: 'Image must be a string' })
  image?: string;
}
