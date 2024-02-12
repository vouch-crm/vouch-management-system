"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3Services = void 0;
const s3Config_1 = require("../services/s3Config");
const enums_1 = require("./enums");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const uploadFile = async (file, fileName, contentType) => {
    try {
        const params = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: fileName,
            Body: file,
            ACL: 'public-read',
            ContentType: contentType
        };
        const uploadResult = await s3Config_1.s3.upload(params).promise();
        return {
            status: enums_1.serviceStatuses.SUCCESS,
            message: 'File uploaded to S3 bucket successfuly!',
            data: uploadResult.Location
        };
    }
    catch (error) {
        return {
            status: enums_1.serviceStatuses.ERROR,
            message: `Error uploading file to S3 bucket: ${error}`,
            data: null
        };
    }
};
exports.S3Services = {
    uploadFile
};
