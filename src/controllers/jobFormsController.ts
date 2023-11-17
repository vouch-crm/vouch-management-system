import express, { Request, Response } from 'express'
import mongoose from 'mongoose'
import { jobFormServices, IReturnJobForm } from '../services/jobFormServices'
import { IJobForm, jobFormsAgent } from '../models/jobFormsModel'
import { s3 } from '../services/s3Services';
import multer from 'multer'
import * as mime from 'mime'
const upload = multer();

const jobFormRouter: express.Router = express.Router();

const jobForm = async (req: Request, res: Response): Promise<void> => {
    const clientID: string = req.params.id;
    const requestData: IJobForm = req.body;
    requestData['client'] = clientID;
    const dbResponse: IReturnJobForm = await jobFormServices.create(requestData);
    if (dbResponse.status === 'success') {
        res.status(201).json({
            message: 'form submitted successfuly!'
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

const getForm = async (req: Request, res: Response): Promise<void> => {
    const clientID: string = req.params.id;
    const requestData = req.body;
    requestData['client'] = clientID;
    const ID = new mongoose.Types.ObjectId('4edd40c86762e0fb12000003')
    const dbResponse: any = await jobFormServices.findOne(clientID);
    if (dbResponse.status === 'success') {
        res.status(200).json({
            message: 'form submitted successfuly!',
            data: dbResponse
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

const uploadFile = async (req: Request, res: Response) => {
    try {
        const clientID: string = req.query.id as string;
        const fieldName: string = req.query.fieldName as string;
        const formName: string = req.query.formName as string;
        const uploadParams = {
            Bucket: 'vouch-crm',
            Key: req.file?.originalname || '',
            Body: req.file?.buffer || '',
            ContentType: mime.getType(req.file?.originalname || '') as string
        };
       
        const result = await s3.upload(uploadParams).promise();
        const jobFormData: IJobForm = {
            client: clientID,
            [formName]: {
                [fieldName]: result.Location
            }
        }
        const dbResponse: IReturnJobForm = await jobFormServices.create(jobFormData);
        if (dbResponse.status === 'failed') {
            return res.status(400).json({
                message: dbResponse.message
            });
        }
        else if (dbResponse.status === 'error') {
            return res.status(500).json({
                message: dbResponse.message
            });
        }
        res.status(201).json({
            message: 'file uploaded successfuly!'
        });

    } catch (error) {
        console.log(error)
        res.status(500)
    }
}

jobFormRouter.post('/job-form/:id', jobForm);
jobFormRouter.post('/upload-file', upload.single('file'), uploadFile);
jobFormRouter.get('/job-form/:id', getForm);

export default jobFormRouter;