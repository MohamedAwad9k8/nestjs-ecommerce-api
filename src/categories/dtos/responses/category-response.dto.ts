import { Exclude, Expose, Transform } from 'class-transformer';
import { Schema } from 'mongoose';

export class CategoryResponseDto {
  @Expose({ name: 'id' })
  @Transform(({ value }): string => value.toString() as string)
  _id: Schema.Types.ObjectId;

  name: string;

  slug: string;

  @Transform(({ value }) => {
    if (!value) return null; // no image
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    return `${baseUrl}/uploads/categories/${value}`;
  })
  image?: string;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  @Exclude()
  __v: number;

  constructor(partial: Partial<CategoryResponseDto>) {
    Object.assign(this, partial);
  }
}
