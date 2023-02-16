import { extname } from 'path';
import { diskStorage as multer } from 'multer';
import { ParseFilePipe, FileTypeValidator } from '@nestjs/common';

export const imageValidator = new ParseFilePipe({
  validators: [
    new FileTypeValidator({
      fileType: /image\/png|image\/jpeg|imagesvg\+xml|image\/svg\+xml/,
    }),
  ],
});

export const storage = (directory: string) => {
  return {
    storage: multer({
      destination: `./public/uploads/${directory}`,
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        const filename = `${uniqueSuffix}${ext}`;
        callback(null, filename);
      },
    }),
  };
};
