import express, { Request, Response } from 'express'
import { jobFormServices, IReturnJobForm } from '../services/jobFormServices'
import { IJobForm } from '../models/jobFormsModel'

const jobFormRouter: express.Router = express.Router();

const jobForm = async (req: Request, res: Response): Promise<void> => {
    const jobID: string = req.params.id;
    const requestData: IJobForm = req.body;
    requestData['job'] = jobID;
    console.log(requestData);
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

jobFormRouter.post('/job-form/:id', jobForm);

export default jobFormRouter;