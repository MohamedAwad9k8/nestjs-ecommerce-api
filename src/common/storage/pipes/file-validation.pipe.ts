import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { UploadFileTypesEnum } from '../enums/valid-upload-extensions.enums';

export type FileValidationOptions = {
  required: boolean;
  maxSizeMB: number;
  allowedTypes: UploadFileTypesEnum[];
};

@Injectable()
export class FileValidationPipe implements PipeTransform {
  constructor(private options: FileValidationOptions) {}

  transform(file: Express.Multer.File) {
    const { required, maxSizeMB, allowedTypes } = this.options;

    if (!file) {
      if (required) {
        throw new BadRequestException('File is required');
      } else {
        return null; // optional file not provided
      }
    }

    if (!allowedTypes.includes(file.mimetype as UploadFileTypesEnum)) {
      throw new BadRequestException(
        `Invalid file type: ${file.mimetype}. Allowed types: ${allowedTypes.join(', ')}`,
      );
    }

    const maxBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxBytes) {
      throw new BadRequestException(`File too large. Max ${maxSizeMB} MB`);
    }

    return file;
  }
}
