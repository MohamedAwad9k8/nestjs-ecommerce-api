export class BrandModel {
  id?: string;
  name?: string;
  slug?: string;
  image?: string;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(partial: Partial<BrandModel>) {
    Object.assign(this, partial);
  }
}
