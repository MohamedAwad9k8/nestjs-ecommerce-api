import { apiPaginationFeaturesDto } from '../dtos/requests/api-pagination-features.dto';
import { QueryObjModel } from '../models/query.model';

export class QueryObjDtoMapper {
  static dtoToModel(dto: apiPaginationFeaturesDto): QueryObjModel {
    return new QueryObjModel({ ...dto });
  }
}
