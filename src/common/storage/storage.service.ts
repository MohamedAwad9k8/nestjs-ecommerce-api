import { Injectable } from '@nestjs/common';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import { promises as fs } from 'fs';
import path from 'path';
import { processImageOptions } from './storage.types';

@Injectable()
export class StorageService {
  async processImage(options: processImageOptions): Promise<string> {
    if (!options.file) {
      throw new Error('No file provided');
    }

    // Ensure folder exists
    const uploadPath = path.join(process.cwd(), 'uploads', options.dirName);
    await fs.mkdir(uploadPath, { recursive: true });

    // Generate unique filename
    const fileName = `${options.dirName}-${uuidv4()}-${Date.now()}.jpeg`;

    // Resize, convert, and save
    await sharp(options.file.buffer)
      .resize(options.width, options.height)
      .toFormat('jpeg')
      .jpeg({ quality: options.quality })
      .toFile(path.join(uploadPath, fileName));

    return fileName;
  }
}
