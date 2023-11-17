"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jobFormServices_1 = require("../services/jobFormServices");
const jobFormRouter = express_1.default.Router();
const jobForm = async (req, res) => {
    const jobID = req.params.id;
    const requestData = req.body;
    requestData['job'] = jobID;
    console.log(requestData);
    const dbResponse = await jobFormServices_1.jobFormServices.create(requestData);
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
jobFormRouter.post('/job-form/:id', jobForm);
exports.default = jobFormRouter;
