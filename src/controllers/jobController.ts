import { IJob } from "../models/jobModel";
import express, {Request, Response} from 'express'
import { jobServices, IReturnJob } from "../services/jobServices";

const jobRouter: express.Router = express.Router();

const clientAccess = async (req: Request, res: Response) => {
    const clientID: string = req.params.id; 
    const jobData = {
        clientAccess: {
            metaAds: req.body.clientAccess.metaStatus === 'Completed'? true : false,
            googleAds: req.body.clientAccess.googleAdsStatus === 'Completed'? true : false,
            tiktokAds: req.body.clientAccess.tiktokStatus === 'Completed'? true : false,
            googleTagManager: req.body.clientAccess.googleTag === 'Completed'? true : false,
            googleAnalytics4: req.body.clientAccess.googleAnalytics === 'Completed'? true : false,
            tracking: req.body.clientAccess.tracking === 'Completed'? true : false,
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

jobRouter.put('/client-access/:id', clientAccess);
jobRouter.post('/create-job', createJob);

export default jobRouter;