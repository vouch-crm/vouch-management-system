import express, { Request, Response } from 'express'
import { clientServices, IReturnClient } from '../services/clientServices';
import { jobServices, IReturnJob } from '../services/jobServices';
import { IClient } from '../models/clientModel';
import { transporter, mailOptions } from '../services/sendMail';
import multer from 'multer'
const upload = multer();

import { IJob } from '../models/jobModel';

const clientRouter: express.Router = express.Router();

const clientOnBoard = async (req: Request, res: Response) => {
    const requestData = req.body;
    console.log(req.body)
    const clientData: IClient = {
        clientBasicInfo: {
            name: requestData.nameOnBoard,
            email: requestData.email,
        },
        monthlyBudget: requestData.monthlyBudget
    }

    const dbResponse: IReturnClient = await clientServices.create(clientData);

    if (dbResponse.status === 'success') {
        console.log(`the created client id: ${dbResponse.data?.id}`);
        console.log(requestData.checkboxes)
        let coreServices = []
        for (const key in requestData.checkboxes) {
            if (requestData.checkboxes[key] === true) {
                coreServices.push(key)
            }
        }
        console.log(coreServices)
        const jobData: IJob = {
            clientSector: `${requestData.selectedSectorOne} / ${requestData.selectedSectorTwo}`,
            vouchAccountLead: requestData.accountLead,
            additionalTeamOnAccount: [requestData.additionalTeam, requestData.SecondAdditionalTeam, requestData.ThirdAdditionalTeam],
            coreServices,
            client: dbResponse.data?.id
        }
        const dbResponse2: IReturnJob = await jobServices.create(jobData);
        if (dbResponse2.status === 'success') {
            res.status(201).json({
                message: 'Client Onboarded Successfuly!',
                data: dbResponse.data
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
    const requestData: IClient = {
        clientBasicInfo: {
            name: req.body.name,
            email: req.body.email,
            companyName: req.body.companyName,
            companyRegisterationNumber: req.body.companyRegistrationNumber,
            vatRegisterationNumber: req.body.vatRegistrationNumber,
            companyRegisteredAddress: req.body.companyAddress,
            companyBillingAddress: req.body.billingAddress,
            businessCommenced: req.body.businessCommenced,
        },
        mainPointOfContact: {
            name: req.body.mainPointOfContact,
            position: req.body.position,
            email: req.body.emailContact,
            telephoneNumber: req.body.TelephoneNo,
            officeAddress: req.body.officeAddress,
        },
        accountContactDetails: {
            name: req.body.mainPointOfContactDetails,
            position: req.body.positionDetails,
            email: req.body.emailContactDetails,
            telephoneNumber: req.body.TelephoneNoDetails,
            officeAddress: req.body.officeAddressDetails,
        },
        additionalInfo: req.body.additionalInfo,
        workflowUpdates: req.body.agreeWorkflow === 'check'? true : false,
        marketingUpdates: req.body.agreeEmails === 'check'? true : false,
    };

    const dbResponse: IReturnClient = await clientServices.update(id, requestData);

    if (dbResponse.status === 'success') {
        res.status(200).json({
            message: 'client updated successfuly!',
            data: dbResponse
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

const getClients = async (req: Request, res: Response) => {
    const id: string = req.params.id;

    const dbResponse: IReturnClient = await clientServices.find();

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
clientRouter.put('/client-setup/:id', clientSetup);
clientRouter.get('/client/:id', getClient);
clientRouter.get('/clients', getClients);
clientRouter.post('/send-mail', sendMail);

export default clientRouter;