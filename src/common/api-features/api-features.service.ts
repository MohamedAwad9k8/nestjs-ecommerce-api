import { Query, HydratedDocument } from 'mongoose';
import {
  QueryObject,
  SearchQuery,
  PaginationResult,
} from './api-features.types';

export class ApiFeatures<T> {
  paginationResult: PaginationResult;

  constructor(
    public mongooseQuery: Query<HydratedDocument<T>[], HydratedDocument<T>>,
    private queryObject: QueryObject,
  ) {}

  // 1) Filtering
  //   filter() {
  //     const queryStringObject = { ...this.queryObject };
  //     const excludeFields = ['page', 'limit', 'sort', 'fields', 'keyword'];
  //     excludeFields.forEach((field) => delete queryStringObject[field]);
  //     // Apply Filtering for gt, gte, lt, lte, in
  //     let queryString = JSON.stringify(queryStringObject);
  //     queryString = queryString.replace(
  //       /\b(gt|gte|lt|lte|in)\b/g,
  //       (match) => `$${match}`,
  //     );
  //     const queryStringObjectFinal = JSON.parse(queryString);
  //     this.mongooseQuery = this.mongooseQuery.find(queryStringObjectFinal);
  //     return this;
  //   }

  // 2) Sorting
  sort() {
    if (this.queryObject.sort) {
      const sortBy = this.queryObject.sort.split(',').join(' ');
      this.mongooseQuery = this.mongooseQuery.sort(sortBy);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort('-createdAt');
    }
    return this;
  }

  // 3) Field limiting
  limitFields() {
    if (this.queryObject.fields) {
      const fields = this.queryObject.fields.split(',').join(' ');
      this.mongooseQuery = this.mongooseQuery.select(fields);
    } else {
      this.mongooseQuery = this.mongooseQuery.select('-__v');
    }
    return this;
  }

  // 4) Search
  search(modelName: string) {
    if (this.queryObject.keyword) {
      const { keyword } = this.queryObject;
      const searchQuery: SearchQuery = {};
      if (modelName === 'Product') {
        searchQuery.$or = [
          { title: { $regex: keyword, $options: 'i' } },
          { description: { $regex: keyword, $options: 'i' } },
        ];
      } else {
        searchQuery.name = { $regex: keyword, $options: 'i' };
      }

      this.mongooseQuery = this.mongooseQuery.find(searchQuery);
    }
    return this;
  }

  // 5) Pagination
  paginate(documentsCount: number) {
    const { page = 1, limit = 50 } = this.queryObject;
    const skip: number = (page - 1) * limit;
    const currentPageEndIndex: number = page * limit;

    //Pagination result
    const pagination: PaginationResult = {
      currentPage: page,
      itemsPerPage: limit,
      numberOfPages: Math.ceil(documentsCount / limit),
    };
    //next page
    if (currentPageEndIndex < documentsCount) {
      pagination.nextPage = page + 1;
    }
    //previous page
    if (skip > 0) {
      pagination.prevPage = page - 1;
    }

    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
    this.paginationResult = pagination;
    return this;
  }
}
