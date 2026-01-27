export class SubCategoryModel {
  id?: string;
  name?: string;
  slug?: string;
  category?: string;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(partial: Partial<SubCategoryModel>) {
    Object.assign(this, partial);
  }
}
