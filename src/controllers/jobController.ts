import { IJob } from "../models/jobModel";
import express, { Request, Response } from 'express'
import { jobServices, IReturnJob } from "../services/jobServices";
import { s3 } from '../services/s3Services';
import multer from "multer";
const upload = multer();


const jobRouter: express.Router = express.Router();

const clientAccess = async (req: Request, res: Response) => {
    const clientID: string = req.params.id;
    try {
        const jobData = {
            clientAccess: {
                metaAds: req.body.metaStatus === 'Completed' ? true : false,
                googleAds: req.body.googleAdsStatus === 'Completed' ? true : false,
                tiktokAds: req.body.tiktokStatus === 'Completed' ? true : false,
                googleTagManager: req.body.googleTag === 'Completed' ? true : false,
                googleAnalytics4: req.body.googleAnalytics === 'Completed' ? true : false,
                tracking: req.body.tracking === 'Completed' ? true : false,
            },
        };

        const dbResponse: IReturnJob = await jobServices.update(clientID, jobData);
        if (dbResponse.status === 'success') {
            res.status(200).json({
                message: 'job document updated successfuly!',
                data: dbResponse.data
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
    } catch (error) {
        console.log(error)
    }
}

const createJob = async (req: Request, res: Response) => {
    const clientID: string = req.params.id;
    const requestData: IJob = req.body;
    const dbResponse: IReturnJob = await jobServices.create(requestData);
    if (dbResponse.status === 'success') {
        res.status(200).json({
            message: 'job document updated successfuly!',
            data: dbResponse.data
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

const findJob = async (req: Request, res: Response) => {
    const clientID: string = req.params.id;
    const dbResponse: IReturnJob = await jobServices.findByID(clientID);
    if (dbResponse.status === 'success') {
        res.status(200).json({
            message: 'job document updated successfuly!',
            data: dbResponse.data
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

const findJobByClient = async (req: Request, res: Response) => {
    const clientID: string = req.params.id;
    const dbResponse: IReturnJob = await jobServices.findOne(clientID);
    if (dbResponse.status === 'success') {
        res.status(200).json({
            message: 'job document updated successfuly!',
            data: dbResponse.data
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
        const uploadParams = {
            Bucket: 'vouch-crm',
            Key: req.file?.originalname || '',
            Body: req.file?.buffer || '',
        };

        const result = await s3.upload(uploadParams).promise();
        const jobData = {
            client: clientID,
            [fieldName]: result.Location
        }
        const dbResponse: IReturnJob = await jobServices.update(clientID, jobData);
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

const updateJob = async (req: Request, res: Response) => {
    const clientID: string = req.params.id;
    const dbResponse: IReturnJob = await jobServices.update(clientID, req.body);
    if (dbResponse.status === 'success') {
        res.status(200).json({
            message: 'job document updated successfuly!',
            data: dbResponse.data
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

jobRouter.get('/find-job-by-client/:id', findJobByClient);
jobRouter.put('/client-access/:id', clientAccess);
jobRouter.put('/create-job', createJob);
jobRouter.get('/find-job/:id', findJob);
jobRouter.put('/update-job/:id', updateJob);
jobRouter.put('/upload-file', upload.single('file'), uploadFile);

export default jobRouter;