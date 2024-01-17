"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jobServices_1 = require("../services/jobServices");
const s3Services_1 = require("../services/s3Services");
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)();
const jobRouter = express_1.default.Router();
const clientAccess = async (req, res) => {
    const clientID = req.params.id;
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
    }
    catch (error) {
        console.log(error);
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
const findJob = async (req, res) => {
    const clientID = req.params.id;
    const dbResponse = await jobServices_1.jobServices.findByID(clientID);
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
const findJobByClient = async (req, res) => {
    const clientID = req.params.id;
    const dbResponse = await jobServices_1.jobServices.findOne(clientID);
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
const uploadFile = async (req, res) => {
    try {
        const clientID = req.query.id;
        const fieldName = req.query.fieldName;
        const uploadParams = {
            Bucket: 'vouch-crm',
            Key: req.file?.originalname || '',
            Body: req.file?.buffer || '',
        };
        const result = await s3Services_1.s3.upload(uploadParams).promise();
        const jobData = {
            client: clientID,
            [fieldName]: result.Location
        };
        const dbResponse = await jobServices_1.jobServices.update(clientID, jobData);
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
    }
    catch (error) {
        console.log(error);
        res.status(500);
    }
};
const updateJob = async (req, res) => {
    const clientID = req.params.id;
    const dbResponse = await jobServices_1.jobServices.update(clientID, req.body);
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
jobRouter.get('/find-job-by-client/:id', findJobByClient);
jobRouter.put('/client-access/:id', clientAccess);
jobRouter.put('/create-job', createJob);
jobRouter.get('/find-job/:id', findJob);
jobRouter.put('/update-job/:id', updateJob);
jobRouter.put('/upload-file', upload.single('file'), uploadFile);
exports.default = jobRouter;
