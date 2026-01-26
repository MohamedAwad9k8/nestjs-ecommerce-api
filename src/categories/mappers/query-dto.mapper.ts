import { CategoryApiFeaturesDto } from '../dtos/requests/category-api-features.dto';
import { QueryObjModel } from '../models/query.model';

export class QueryObjDtoMapper {
  static dtoToModel(dto: CategoryApiFeaturesDto): QueryObjModel {
    return new QueryObjModel({ ...dto });
  }
}
