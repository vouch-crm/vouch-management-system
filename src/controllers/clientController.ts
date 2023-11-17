import express, { Request, Response } from 'express'
import { clientServices } from '../services/clientServices';
import { IClient } from '../models/clientModel';
import { transporter, mailOptions } from '../services/sendMail';
import { s3 } from '../services/uploadFile';
import multer from 'multer'
const upload = multer();

interface S3Error {
    code?: string;
    message: string;
}

interface S3Data {
    Location: string;
    Bucket: string;
    Key: string;
}

interface UploadParams {
    Body: string | Buffer;
    Bucket: string;
    Key: string;
}


const clientRouter: express.Router = express.Router();

const clientSetup = async (req: Request, res: Response) => {
    const requestData: IClient = req.body;
    const dbResponse = await clientServices.addClient(requestData);
    if (dbResponse.status === 'success') {
        res.status(201).json({
            message: 'client created successfuly!'
        });
    }
    else if (dbResponse.status === 'failed') {
        res.status(400).json({
            message: dbResponse.message
        });
    }
    else {
        res.status(500).json({
            message: dbResponse.message
        });
    }
}

const sendMail = async (req: Request, res: Response) => {
    try {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                throw new Error(error.message)
            } else {
                res.status(201).json('Email sent: ' + info.response);
            }
        })
    } catch (error) {
        console.log(error)
    }
}

const uploadFile = async (req: Request, res: Response) => {
    try {
        const test = req.body
        console.log(test)
        const uploadParams: UploadParams = {
            Bucket: 'vouch-crm',
            Key: req.file?.originalname || '',
            Body: req.file?.buffer || '',
        };
        s3.upload(uploadParams, (err: S3Error, data: S3Data) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error uploading file to S3');
            } else {
                console.log('File uploaded to S3. Location:', data.Location);
                res.send('File uploaded successfully!');
            }
        });
        res.status(201)
    } catch (error) {
        console.log(error)
        res.status(500)
    }
}

clientRouter.post('/client-setup', clientSetup);
clientRouter.post('/send-mail', sendMail)
clientRouter.post('/upload-file', upload.single('file'), uploadFile)

export default clientRouter;