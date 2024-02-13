"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const enums_1 = require("../services/enums");
const salaryUpdatesServices_1 = require("../services/salaryUpdatesServices");
const validation_1 = require("../middlewares/validation");
const adminMiddleware_1 = require("../middlewares/adminMiddleware");
const salaryUpdatesRouter = express_1.default.Router();
const create = async (req, res) => {
    const salaryData = req.body;
    switch (salaryData.payFrequency) {
        case enums_1.payFrequency.WEEKLY:
            break;
        case enums_1.payFrequency.MONTHLY:
            break;
        case enums_1.payFrequency.FOUR_WEEKLY:
            break;
        case enums_1.payFrequency.BI_WEEKLY:
            break;
        case enums_1.payFrequency.BI_MONTHLY:
            break;
        default:
            return res.status(404).json({
                message: 'Invalid pay frequency!'
            });
    }
    switch (salaryData.basis) {
        case enums_1.basis.PER_WEEK:
            break;
        case enums_1.basis.PER_HOUR:
            break;
        case enums_1.basis.PER_DAY:
            break;
        case enums_1.basis.PER_MONTH:
            break;
        case enums_1.basis.PER_ANNUM:
            break;
        default:
            return res.status(404).json({
                message: 'Invalid basis!'
            });
    }
    const dbResponse = await salaryUpdatesServices_1.salaryUpdatesServices.create(salaryData);
    if (dbResponse.status !== enums_1.serviceStatuses.SUCCESS) {
        return res.status(400).json({
            message: dbResponse.message
        });
    }
    res.status(201).json({
        message: dbResponse.message,
        data: dbResponse.data
    });
};
const getAll = async (req, res) => {
    const salaries = await salaryUpdatesServices_1.salaryUpdatesServices.getAll();
    if (salaries.status !== enums_1.serviceStatuses.SUCCESS) {
        return res.status(400).json({
            message: salaries.message
        });
    }
    res.status(200).json({
        data: salaries.data
    });
};
const update = async (req, res) => {
    const ID = req.params.id;
    const updatedData = req.body;
    const dbResponse = await salaryUpdatesServices_1.salaryUpdatesServices.update(ID, updatedData);
    if (dbResponse.status === enums_1.serviceStatuses.FAILED) {
        return res.status(404).json({
            message: dbResponse.message
        });
    }
    else if (dbResponse.status === enums_1.serviceStatuses.ERROR) {
        return res.status(400).json({
            message: dbResponse.message
        });
    }
    res.status(200).json({
        message: dbResponse.message,
        data: dbResponse.data
    });
};
const del = async (req, res) => {
    const ID = req.params.id;
    const dbResponse = await salaryUpdatesServices_1.salaryUpdatesServices.del(ID);
    if (dbResponse.status === enums_1.serviceStatuses.FAILED) {
        return res.status(404).json({
            message: dbResponse.message
        });
    }
    else if (dbResponse.status === enums_1.serviceStatuses.ERROR) {
        return res.status(400).json({
            message: dbResponse.message
        });
    }
    res.status(200).json({
        message: dbResponse.message,
    });
};
salaryUpdatesRouter.post('/employee-salary', adminMiddleware_1.checkIfAdmin, validation_1.validationFunctions
    .createSalaryUpdateBodyValidationRules(), validation_1.validationFunctions.validationMiddleware, create);
salaryUpdatesRouter.get('/employee-salary', adminMiddleware_1.checkIfAdmin, getAll);
salaryUpdatesRouter.put('/employee-salary/:id', adminMiddleware_1.checkIfAdmin, update);
salaryUpdatesRouter.delete('/employee-salary/:id', adminMiddleware_1.checkIfAdmin, del);
exports.default = salaryUpdatesRouter;
