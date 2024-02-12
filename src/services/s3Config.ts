import AWS from 'aws-sdk'
import dotenv from 'dotenv'

dotenv.config();

AWS.config.update({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    region: process.env.REGION
});

export const s3 = new AWS.S3()