"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const revenueServices_1 = require("../services/revenueServices");
const enums_1 = require("../services/enums");
const express_1 = __importDefault(require("express"));
const validation_1 = require("../middlewares/validation");
const revenueMiddlware_1 = require("../middlewares/revenueMiddlware");
const projectServices_1 = require("../services/projectServices");
const revenueRouter = express_1.default.Router();
const create = async (req, res) => {
    const requestData = req.body;
    const newRevenue = await revenueServices_1.revenueServices.create(requestData);
    if (newRevenue.status !== enums_1.serviceStatuses.SUCCESS) {
        return res.status(400).json({
            message: newRevenue.message
        });
    }
    res.status(201).json({
        message: newRevenue.message,
        data: newRevenue.data
    });
};
const getAll = async (req, res) => {
    const revenues = await revenueServices_1.revenueServices.getAll();
    if (revenues.status !== enums_1.serviceStatuses.SUCCESS) {
        return res.status(400).json({
            message: revenues.message
        });
    }
    res.status(200).json({
        data: revenues.data
    });
};
const updateRevenueCellValue = async (req, res) => {
    const ID = req.params.id;
    const clientID = req.params.clientID;
    const { monthName, updatedCell } = req.body;
    const dbResponse = await revenueServices_1.revenueServices.updateRevenueCellValue(ID, monthName, updatedCell);
    console.log(updatedCell.fees);
    console.log(req.body);
    console.log(req.params);
    const project = await projectServices_1.projectServices.getProject(clientID, 'retainer');
    //@ts-ignore
    if (project.data.length === 0) {
        await projectServices_1.projectServices.create({ name: 'retainer', budget: updatedCell.retainer, clientID });
    }
    for (const fee in updatedCell.fees) {
        const project = await projectServices_1.projectServices.getProject(clientID, fee);
        //@ts-ignore
        if (project.data.length === 0) {
            await projectServices_1.projectServices.create({ name: fee, budget: updatedCell.fees[fee], clientID });
        }
    }
    if (dbResponse.status === enums_1.serviceStatuses.ERROR) {
        return res.status(400).json({
            message: dbResponse.message
        });
    }
    else if (dbResponse.status === enums_1.serviceStatuses.FAILED) {
        return res.status(404).json({
            message: dbResponse.message
        });
    }
    res.status(200).json({
        message: dbResponse.message
    });
};
const updateConvertedCellValue = async (req, res) => {
    const ID = req.params.id;
    const { clientID, type, year, monthName, updatedValues } = req.body;
    const cellValues = {
        clientID: clientID,
        type: type,
        year: year,
        monthName: monthName,
        updatedValues: updatedValues
    };
    const dbResponse = await revenueServices_1.revenueServices.updateConvertedCellValues(cellValues);
    if (dbResponse.status === enums_1.serviceStatuses.FAILED) {
        return res.status(400).json({
            message: dbResponse.message
        });
    }
    else if (dbResponse.status === enums_1.serviceStatuses.ERROR) {
        return res.status(400).json({
            message: dbResponse.message
        });
    }
    const dbResponse2 = await revenueServices_1.revenueServices.removeCellData(ID, monthName);
    if (dbResponse.status === enums_1.serviceStatuses.FAILED) {
        return res.status(404).json({
            message: dbResponse2.message
        });
    }
    else if (dbResponse2.status === enums_1.serviceStatuses.ERROR) {
        return res.status(400).json({
            message: dbResponse2.message
        });
    }
    res.status(200).json({
        message: dbResponse2.message
    });
};
const del = async (req, res) => {
    const ID = req.params.id;
    const deletedRevenue = await revenueServices_1.revenueServices.del(ID);
    if (deletedRevenue.status === enums_1.serviceStatuses.FAILED) {
        return res.status(404).json({
            message: deletedRevenue.message
        });
    }
    else if (deletedRevenue.status === enums_1.serviceStatuses.ERROR) {
        return res.status(400).json({
            message: deletedRevenue.message
        });
    }
    res.status(200).json({
        message: deletedRevenue.message
    });
};
revenueRouter.post('/revenue', validation_1.validationFunctions.createRevenueBodyValidationRules(), validation_1.validationFunctions.validationMiddleware, revenueMiddlware_1.revenueMiddleware.checkClientIDAndYearExist, create);
revenueRouter.get('/revenue', getAll);
revenueRouter.put('/revenue-cell-update/:id/:clientID', validation_1.validationFunctions.updateRevenueCellBodyValidations(), validation_1.validationFunctions.validationMiddleware, updateRevenueCellValue);
revenueRouter.put('/revenue-converter-cell-update/:id', validation_1.validationFunctions.updateConvertedRevenueCellBodyValidations(), validation_1.validationFunctions.validationMiddleware, updateConvertedCellValue);
revenueRouter.delete('/revenue/:id', del);
exports.default = revenueRouter;
