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
const getAll = async (req, res) => {
    const allEntries = await timeSheetEntryServices_1.timeSheetEntryServices.getAll();
    if (allEntries.status !== enums_1.serviceStatuses.SUCCESS) {
        return res.status(400).json({
            message: allEntries.message
        });
    }
    res.status(200).json({
        data: allEntries.data
    });
};
const getEntriesWithinPeriod = async (req, res) => {
    const employeeID = req.params.employeeID;
    const startDate = req.params.startDate;
    const endDate = req.params.endDate;
    const entries = await timeSheetEntryServices_1.timeSheetEntryServices.getEntriesWithinPeriod(employeeID, startDate, endDate);
    if (entries.status !== enums_1.serviceStatuses.SUCCESS) {
        return res.status(400).json({
            message: entries.message
        });
    }
    res.status(200).json({
        data: entries.data
    });
};
const update = async (req, res) => {
    const entryID = req.params.id;
    const requestData = req.body;
    if (requestData.timeTracked) {
        const hourlyRate = await employeeServices_1.employeeServices.getEmpHourlyRate(requestData.employeeID);
        if (hourlyRate === undefined) {
            return res.status(404).json({
                message: `No employee found with this ID: ${requestData.employeeID}`
            });
        }
        requestData['cost'] = ((requestData.timeTracked / 3600) * hourlyRate);
    }
    const updatedEntry = await timeSheetEntryServices_1.timeSheetEntryServices.update(entryID, requestData);
    if (updatedEntry.status === enums_1.serviceStatuses.FAILED) {
        return res.status(404).json({
            message: updatedEntry.message
        });
    }
    else if (updatedEntry.status === enums_1.serviceStatuses.ERROR) {
        return res.status(400).json({
            message: updatedEntry.message
        });
    }
    res.status(200).json({
        message: updatedEntry.message,
        data: updatedEntry.data
    });
};
const del = async (req, res) => {
    const entryIDs = req.body.IDs;
    const deletedEntry = await timeSheetEntryServices_1.timeSheetEntryServices.del(entryIDs);
    if (deletedEntry.status === enums_1.serviceStatuses.FAILED) {
        return res.status(404).json({
            message: deletedEntry.message
        });
    }
    else if (deletedEntry.status === enums_1.serviceStatuses.ERROR) {
        return res.status(400).json({
            message: deletedEntry.message
        });
    }
    res.status(200).json({
        message: deletedEntry.message,
        data: deletedEntry.data
    });
};
timeSheetController.post('/time-sheet-entry', create);
timeSheetController.get('/time-sheet-entry', getAll);
timeSheetController.get('/time-sheet-entry/:employeeID/:startDate/:endDate', getEntriesWithinPeriod);
timeSheetController.patch('/time-sheet-entry/:id', update);
timeSheetController.post('/time-sheet-entries', del);
exports.default = timeSheetController;
