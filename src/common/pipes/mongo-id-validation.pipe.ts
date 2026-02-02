import {
  PipeTransform,
  Injectable,
  BadRequestException,
  ArgumentMetadata,
} from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class MongoIDValidationPipe implements PipeTransform<string, string> {
  transform(value: string, metadata: ArgumentMetadata): string {
    if (!isValidObjectId(value)) {
      throw new BadRequestException('Invalid MongoDB ID');
    }
    return value;
  }
}
