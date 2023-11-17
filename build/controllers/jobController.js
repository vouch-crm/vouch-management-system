"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jobServices_1 = require("../services/jobServices");
const jobRouter = express_1.default.Router();
const clientAccess = async (req, res) => {
    const clientID = req.params.id;
    const jobData = {
        clientAccess: {
            metaAds: req.body.clientAccess.metaStatus === 'Completed' ? true : false,
            googleAds: req.body.clientAccess.googleAdsStatus === 'Completed' ? true : false,
            tiktokAds: req.body.clientAccess.tiktokStatus === 'Completed' ? true : false,
            googleTagManager: req.body.clientAccess.googleTag === 'Completed' ? true : false,
            googleAnalytics4: req.body.clientAccess.googleAnalytics === 'Completed' ? true : false,
            tracking: req.body.clientAccess.tracking === 'Completed' ? true : false,
        },
    };
    const dbResponse = await jobServices_1.jobServices.update(clientID, jobData);
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
};
const createJob = async (req, res) => {
    const clientID = req.params.id;
    const requestData = req.body;
    const dbResponse = await jobServices_1.jobServices.create(requestData);
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
};
jobRouter.put('/client-access/:id', clientAccess);
jobRouter.post('/create-job', createJob);
exports.default = jobRouter;
