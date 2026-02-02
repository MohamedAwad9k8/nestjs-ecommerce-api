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

  transform(
    files:
      | Express.Multer.File
      | Express.Multer.File[]
      | { [fieldname: string]: Express.Multer.File[] },
  ) {
    const { required, maxSizeMB, allowedTypes } = this.options;

    if (!files) {
      if (required) {
        throw new BadRequestException('File is required');
      } else {
        return null; // optional file not provided
      }
    }

    // Normalize to array
    let fileArray: Express.Multer.File[] = [];

    if (Array.isArray(files)) {
      fileArray = files; // single field with multiple files
    } else if ((files as any).fieldname === undefined) {
      // FileFieldsInterceptor returns an object
      Object.values(files).forEach((arr: Express.Multer.File[]) => {
        fileArray.push(...arr);
      });
    } else {
      // single file
      fileArray = [files as Express.Multer.File];
    }

    // Validate each file
    fileArray.forEach((file) => {
      if (
        !file.mimetype ||
        !allowedTypes.includes(file.mimetype as UploadFileTypesEnum)
      ) {
        throw new BadRequestException(
          `Invalid file type: ${file.mimetype}. Allowed types: ${allowedTypes.join(', ')}`,
        );
      }

      const maxBytes = maxSizeMB * 1024 * 1024;
      if (file.size > maxBytes) {
        throw new BadRequestException(`File too large. Max ${maxSizeMB} MB`);
      }
    });

    return files;
  }
}
