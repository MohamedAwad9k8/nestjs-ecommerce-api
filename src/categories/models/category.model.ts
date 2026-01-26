export class CategoryModel {
  id?: string;
  name?: string;
  slug?: string;
  image?: string;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(partial: Partial<CategoryModel>) {
    Object.assign(this, partial);
  }
}
