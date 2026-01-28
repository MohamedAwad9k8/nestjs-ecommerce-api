import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({
  timestamps: true,
})
export class Product {
  @Prop({ type: String, required: true, unique: true })
  title: string;

  @Prop({ type: String, lowercase: true, required: true })
  slug: string;

  @Prop({ type: String, lowercase: true, minlength: 20, required: true })
  description: string;

  @Prop({ type: Number, required: true })
  quantity: number;

  @Prop({ type: Number, default: 0 })
  sold: number;

  @Prop({ type: Number, required: true, min: 0, max: 500000 })
  price: number;

  @Prop({ type: Number })
  priceAfterDiscount: number;

  @Prop({ type: [String] })
  colors: string[];

  @Prop({ type: String, required: true })
  imageCover: string;

  @Prop({ type: [String] })
  images: string[];

  @Prop({
    type: Types.ObjectId,
    ref: 'Category',
    required: true,
  })
  category: Types.ObjectId;

  @Prop({
    type: [Types.ObjectId],
    ref: 'SubCategory',
    required: true,
  })
  subCategories: Types.ObjectId[];

  @Prop({
    type: Types.ObjectId,
    ref: 'Brand',
    required: true,
  })
  brand: Types.ObjectId;

  @Prop({ type: Number, min: 1, max: 5 })
  ratingsAverage: number;

  @Prop({ type: Number, default: 0 })
  ratingsQuantity: number;

  createdAt: Date;
  updatedAt: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
