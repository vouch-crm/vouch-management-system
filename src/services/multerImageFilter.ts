import { Request } from 'express'
// Multer file filter for image files
export const imageFilter = function(req: Request, file: any, cb: Function) {
    // Accept only image files
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  };