"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const timeSheetEntryServices_1 = require("../services/timeSheetEntryServices");
const employeeServices_1 = require("../services/employeeServices");
const enums_1 = require("../services/enums");
const express_1 = __importDefault(require("express"));
const timeSheetController = express_1.default.Router();
const create = async (req, res) => {
    let requestData = req.body;
    const empHourlyRate = await employeeServices_1.employeeServices.getEmpHourlyRate(requestData.employeeID);
    if (empHourlyRate === undefined) {
        return res.status(404).json({
            message: `No employee found with this ID: ${requestData.employeeID}`
        });
    }
    requestData.cost = (requestData.timeTracked / 3600) * empHourlyRate;
    const newEntry = await timeSheetEntryServices_1.timeSheetEntryServices.create(requestData);
    if (newEntry.status !== enums_1.serviceStatuses.SUCCESS) {
        return res.status(400).json({
            message: newEntry.message
        });
    }
    res.status(201).json({
        message: newEntry.message,
        data: newEntry.data
    });
};
timeSheetController.post('/time-sheet-entry', create);
exports.default = timeSheetController;
