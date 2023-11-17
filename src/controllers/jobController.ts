import { IJob } from "../models/jobModel";
import express, {Request, Response} from 'express'
import { jobServices, IReturnJob } from "../services/jobServices";

const jobRouter: express.Router = express.Router();

const clientAccess = async (req: Request, res: Response) => {
    const clientID: string = req.params.id;
    const requestData: IJob = req.body;
    const dbResponse: IReturnJob = await jobServices.update(clientID, requestData);
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

jobRouter.put('/client-access', clientAccess);

export default jobRouter;