"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const timeSheetTemplateServices_1 = require("../services/timeSheetTemplateServices");
const enums_1 = require("../services/enums");
const express_1 = __importDefault(require("express"));
const timeSheetTemplateRouter = express_1.default.Router();
const create = async (req, res) => {
    const requestData = req.body;
    const newTemplate = await timeSheetTemplateServices_1.TimeSheetTemplateServices.create(requestData);
    if (newTemplate.status !== enums_1.serviceStatuses.SUCCESS) {
        return res.status(400).json({
            message: newTemplate.message
        });
    }
    res.status(201).json({
        message: newTemplate.message,
        data: newTemplate.data
    });
};
const getAll = async (req, res) => {
    const templates = await timeSheetTemplateServices_1.TimeSheetTemplateServices.getAll();
    if (templates.status !== enums_1.serviceStatuses.SUCCESS) {
        return res.status(400).json({
            message: templates.message
        });
    }
    res.status(200).json({
        data: templates.data
    });
};
const getByID = async (req, res) => {
    const ID = req.params.id;
    const template = await timeSheetTemplateServices_1.TimeSheetTemplateServices.getByID(ID);
    if (template.status === enums_1.serviceStatuses.FAILED) {
        return res.status(404).json({
            message: template.message
        });
    }
    else if (template.status === enums_1.serviceStatuses.ERROR) {
        return res.status(400).json({
            message: template.message
        });
    }
    res.status(200).json({
        data: template.data
    });
};
const getByEmployeeID = async (req, res) => {
    const empID = req.params.empID;
    const templates = await timeSheetTemplateServices_1.TimeSheetTemplateServices.getByEmployeeID(empID);
    if (templates.status === enums_1.serviceStatuses.ERROR) {
        return res.status(400).json({
            message: templates.message
        });
    }
    res.status(200).json({
        data: templates.data
    });
};
const del = async (req, res) => {
    const ID = req.params.id;
    const deletedTemplate = await timeSheetTemplateServices_1.TimeSheetTemplateServices.del(ID);
    if (deletedTemplate.status === enums_1.serviceStatuses.FAILED) {
        return res.status(404).json({
            message: deletedTemplate.message
        });
    }
    else if (deletedTemplate.status === enums_1.serviceStatuses.ERROR) {
        return res.status(400).json({
            message: deletedTemplate.message
        });
    }
    res.status(200).json({
        data: deletedTemplate.message
    });
};
timeSheetTemplateRouter.post('/time-sheet-template', create);
timeSheetTemplateRouter.get('/time-sheet-template', getAll);
timeSheetTemplateRouter.get('/time-sheet-template/:id', getByID);
timeSheetTemplateRouter.get('/time-sheet-template-empID/:empID', getByEmployeeID);
timeSheetTemplateRouter.delete('/time-sheet-template/:id', del);
exports.default = timeSheetTemplateRouter;
