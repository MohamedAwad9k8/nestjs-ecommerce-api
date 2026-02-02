export type processImageOptions = {
  file: Express.Multer.File;
  dirName: string;
  width: number;
  height: number;
  quality: number;
};
