"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const revenueServices_1 = require("../services/revenueServices");
const enums_1 = require("../services/enums");
const express_1 = __importDefault(require("express"));
const validation_1 = require("../middlewares/validation");
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
    const { monthName, updatedCell } = req.body;
    const dbResponse = await revenueServices_1.revenueServices.updateRevenueCellValue(ID, monthName, updatedCell);
    if (dbResponse.status !== enums_1.serviceStatuses.SUCCESS) {
        return res.status(400).json({
            message: dbResponse.message
        });
    }
    res.status(200).json({
        message: dbResponse.message
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
revenueRouter.post('/revenue', validation_1.validationFunctions.createRevenueBodyValidationRules(), validation_1.validationFunctions.validationMiddleware, create);
revenueRouter.get('/revenue', getAll);
revenueRouter.put('/revenue-cell-update/:id', updateRevenueCellValue);
revenueRouter.delete('/revenue/:id', del);
exports.default = revenueRouter;