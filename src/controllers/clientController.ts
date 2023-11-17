import express, { Request, Response } from 'express'
import { clientServices, IReturnClient } from '../services/clientServices';
import { jobServices, IReturnJob } from '../services/jobServices';
import { IClient } from '../models/clientModel';
import { transporter, mailOptions } from '../services/sendMail';
import { s3 } from '../services/s3Services';
import multer from 'multer'
import * as mime from 'mime'
const upload = multer();

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
        console.log(`the created client id: ${dbResponse.data?.id}`);
        const jobData: IJob = {
            clientSector: requestData.clientSector,
            vouchAccountLead: requestData.vouchAccountLead,
            additionalTeamOnAccount: requestData.additionalTeamOnAccount,
            coreServices: requestData.coreServices,
            client: dbResponse.data?.id
        }
        const dbResponse2: IReturnJob = await jobServices.create(jobData);
        if (dbResponse2.status === 'success') {
            res.status(201).json({
                message: 'Client Onboarded Successfuly!'
            });
        }
        else if (dbResponse2.status === 'failed') {
            res.status(400).json({
                message: dbResponse2.message
            });
        }
        else {
            res.status(500).json({
                message: dbResponse2.message
            });
        }
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
clientRouter.get('/client/:id', getClient);

export default clientRouter;