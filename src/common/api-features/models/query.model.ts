export class QueryObjModel {
  page?: number;
  limit?: number;
  keyword?: string;
  sort?: string;
  fields?: string;

  constructor(partial: Partial<QueryObjModel>) {
    Object.assign(this, partial);
  }
}
