import { PaginationResult } from 'src/common/api-features/api-features.types';
import { CategoryResponseDto } from './category-response.dto';

export class GetAllDto {
  results: number;
  paginationResult: PaginationResult;
  data: CategoryResponseDto[];
}
