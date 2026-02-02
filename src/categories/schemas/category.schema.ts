import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
})
export class Category {
  @Prop({ type: String, required: true, unique: true })
  name: string;

  @Prop({ type: String, lowercase: true })
  slug: string;

  @Prop({ type: String })
  image?: string;

  createdAt: Date;
  updatedAt: Date;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
