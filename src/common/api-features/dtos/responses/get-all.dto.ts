import { PaginationResult } from 'src/common/api-features/types/pagination-results.types';

export class GetAllDto<T> {
  results: number;
  paginationResult: PaginationResult;
  data: T[];
}
