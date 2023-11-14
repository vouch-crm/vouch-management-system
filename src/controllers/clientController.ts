import express, { Request, Response } from 'express'
import { clientServices, IReturnClient } from '../services/clientServices';
import { jobServices, IReturnJob } from '../services/jobServices';
import { IClient } from '../models/clientModel';
import { IJob } from '../models/jobModel';

const clientRouter: express.Router = express.Router();

const clientOnBoard = async (req: Request, res: Response) => {
    const requestData = req.body;
    const clientData: IClient = {
        clientBasicInfo: {
            name: requestData.clientBasicInfo.name,
            email: requestData.clientBasicInfo.email
        }
    }

    const dbResponse: IReturnClient = await clientServices.create(clientData);

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

const clientSetup = async (req: Request, res: Response) => {
    const id: string = req.params.id;
    const requestData: IClient = req.body;

    const dbResponse: IReturnClient = await clientServices.update(id, requestData);

    if (dbResponse.status === 'success') {
        res.status(200).json({
            message: 'client updated successfuly!'
        });
    }
    else if (dbResponse.status === 'failed') {
        res.status(404).json({
            message: dbResponse.message
        });
    }
    else {
        res.status(500).json({
            message: dbResponse.message
        });
    }
}

const getClient = async (req: Request, res: Response) => {
    const id: string = req.params.id;

    const dbResponse: IReturnClient = await clientServices.findByID(id);

    if (dbResponse.status === 'success') {
        res.status(200).json({
            data: dbResponse.data
        });
    }
    else if (dbResponse.status === 'failed') {
        res.status(404).json({
            message: 'client not found'
        });
    }
    else {
        res.status(500).json({
            message: dbResponse.message
        });
    }
}

clientRouter.post('/client-onboard', clientOnBoard);
clientRouter.put('/client-setup', clientSetup);
clientRouter.get('/client', getClient);

export default clientRouter;