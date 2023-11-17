"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jobFormServices_1 = require("../services/jobFormServices");
const s3Services_1 = require("../services/s3Services");
const multer_1 = __importDefault(require("multer"));
const mime = __importStar(require("mime"));
const upload = (0, multer_1.default)();
const jobFormRouter = express_1.default.Router();
const jobForm = async (req, res) => {
    const clientID = req.params.id;
    const requestData = req.body;
    requestData['client'] = clientID;
    const dbResponse = await jobFormServices_1.jobFormServices.update(clientID, requestData);
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
};
const uploadFile = async (req, res) => {
    try {
        const clientID = req.query.id;
        const fieldName = req.query.fieldName;
        const formName = req.query.formName;
        const uploadParams = {
            Bucket: 'vouch-crm',
            Key: req.file?.originalname || '',
            Body: req.file?.buffer || '',
            ContentType: mime.getType(req.file?.originalname || '')
        };
        const result = await s3Services_1.s3.upload(uploadParams).promise();
        const jobFormData = {
            client: clientID,
            [formName]: {
                [fieldName]: result.Location
            }
        };
        const dbResponse = await jobFormServices_1.jobFormServices.create(jobFormData);
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
jobFormRouter.post('/job-form/:id', jobForm);
jobFormRouter.post('/upload-file', upload.single('file'), uploadFile);
exports.default = jobFormRouter;
