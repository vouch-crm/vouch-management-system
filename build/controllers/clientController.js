"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const clientServices_1 = require("../services/clientServices");
const jobServices_1 = require("../services/jobServices");
const clientRouter = express_1.default.Router();
const clientOnBoard = async (req, res) => {
    const requestData = req.body;
    const clientData = {
        clientBasicInfo: {
            name: requestData.clientBasicInfo.name,
            email: requestData.clientBasicInfo.email
        }
    };
    const dbResponse = await clientServices_1.clientServices.create(clientData);
    if (dbResponse.status === 'success') {
        console.log(`the created client id: ${dbResponse.data?.id}`);
        const jobData = {
            clientSector: requestData.clientSector,
            vouchAccountLead: requestData.vouchAccountLead,
            additionalTeamOnAccount: requestData.additionalTeamOnAccount,
            coreServices: requestData.coreServices,
            client: dbResponse.data?.id
        };
        const dbResponse2 = await jobServices_1.jobServices.create(jobData);
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
};
const clientSetup = async (req, res) => {
    const id = req.params.id;
    const requestData = req.body;
    const dbResponse = await clientServices_1.clientServices.update(id, requestData);
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
};
const getClient = async (req, res) => {
    const id = req.params.id;
    const dbResponse = await clientServices_1.clientServices.findByID(id);
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
};
clientRouter.post('/client-onboard', clientOnBoard);
clientRouter.put('/client-setup', clientSetup);
clientRouter.get('/client/:id', getClient);
exports.default = clientRouter;
