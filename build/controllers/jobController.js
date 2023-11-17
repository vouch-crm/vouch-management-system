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
    const requestData = req.body;
    const dbResponse = await jobServices_1.jobServices.update(clientID, requestData);
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
jobRouter.put('/client-access', clientAccess);
exports.default = jobRouter;
