import { s3 } from '../services/s3Config';
import { serviceStatuses } from './enums';
import { Buffer } from 'buffer';
import dotenv from 'dotenv';

dotenv.config();

export type S3Return = {
    status: string,
    message: string | null,
    data: string | null
}

const uploadFile = async (file: Buffer, fileName: string, contentType: string): Promise<S3Return> => {
    try {
        const params = {
            Bucket: process.env.S3_BUCKET_NAME as string,
            Key: fileName,
            Body: file,
            ACL: 'public-read',
            ContentType: contentType
        };
        
        const uploadResult = await s3.upload(params).promise();
        return {
            status: serviceStatuses.SUCCESS,
            message: 'File uploaded to S3 bucket successfuly!',
            data: uploadResult.Location
        }
    } catch (error) {
        return {
            status: serviceStatuses.ERROR,
            message: `Error uploading file to S3 bucket: ${error}`,
            data: null
        }
    }
}

export const S3Services = {
    uploadFile
}