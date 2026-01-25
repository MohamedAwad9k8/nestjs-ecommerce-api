import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CategoryApiFeaturesDto {
  @IsOptional()
  @Type(() => Number)
  @Transform(({ value }): number =>
    Array.isArray(value) ? value[value.length - 1] : value,
  )
  @IsInt()
  @Min(1)
  page: number;

  @IsOptional()
  @Type(() => Number)
  @Transform(({ value }): number =>
    Array.isArray(value) ? value[value.length - 1] : value,
  )
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number;

  @IsOptional()
  @IsString()
  @Transform(({ value }): string =>
    Array.isArray(value) ? value[value.length - 1] : value,
  )
  @MinLength(2)
  @MaxLength(50)
  keyword?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }): string =>
    Array.isArray(value) ? value[value.length - 1] : value,
  )
  @IsIn(['name', 'createdAt', 'updatedAt', '-name', '-createdAt', '-updatedAt'])
  sort?: string;

  @IsOptional()
  @IsString()
  fields?: string;
}
