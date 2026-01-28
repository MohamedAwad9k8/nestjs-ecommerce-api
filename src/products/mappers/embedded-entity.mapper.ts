import { EmbeddedEntityModel } from '../models/embedded-entity.model';
import { EmbeddedEntityDto } from '../dtos/responses/embedded-entity.dto';
import { ConflictException } from '@nestjs/common';

export class EmbeddedEntityMapper {
  static modelToDto(model: EmbeddedEntityModel): EmbeddedEntityDto {
    if (!model.id || !model.name || !model.slug) {
      throw new ConflictException(
        'EmbeddedEntityModel is not fully populated for response',
      );
    }

    return {
      id: model.id,
      name: model.name,
      slug: model.slug,
    };
  }

  static dtoToModel(id: string): EmbeddedEntityModel {
    if (!id) {
      throw new ConflictException('EmbeddedEntity ID is required');
    }

    // Initially only ID is set, name/slug will be enriched later
    return new EmbeddedEntityModel({ id });
  }
}
