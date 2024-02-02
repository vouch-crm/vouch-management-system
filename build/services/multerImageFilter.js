"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.imageFilter = void 0;
// Multer file filter for image files
const imageFilter = function (req, file, cb) {
    // Accept only image files
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
exports.imageFilter = imageFilter;
