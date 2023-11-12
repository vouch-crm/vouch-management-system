import express, {Request, Response} from 'express'
import { clientServices } from '../services/clientServices';
import { IClient } from '../models/clientModel';

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

clientRouter.post('/client-setup', clientSetup);

export default clientRouter;