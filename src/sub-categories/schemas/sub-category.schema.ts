import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({
  timestamps: true,
})
export class SubCategory {
  @Prop({ type: String, required: true, unique: true })
  name: string;

  @Prop({ type: String, lowercase: true })
  slug: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'Category',
    required: true,
  })
  category: Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

export const SubCategorySchema = SchemaFactory.createForClass(SubCategory);
