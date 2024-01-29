"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const enums_1 = require("../services/enums");
const employeeRequestServices_1 = require("../services/employeeRequestServices");
const validation_1 = require("../middlewares/validation");
const empRequestRouter = express_1.default.Router();
const create = async (req, res) => {
    const requestData = req.body;
    const status = 'pending';
    let requestType;
    switch (requestData.type) {
        case enums_1.employeeRequests.EARLYLEAVE:
            requestType = enums_1.employeeRequests.EARLYLEAVE;
            break;
        case enums_1.employeeRequests.HOLIDAY:
            requestType = enums_1.employeeRequests.HOLIDAY;
            break;
        case enums_1.employeeRequests.SICK:
            requestType = enums_1.employeeRequests.SICK;
            break;
        case enums_1.employeeRequests.WORKFROMHOME:
            requestType = enums_1.employeeRequests.WORKFROMHOME;
            break;
        default:
            return res.status(400).json({
                message: 'Invalid request type'
            });
    }
    const employeeRequestData = {
        type: requestData.type,
        status: status,
        requestedDay: requestData.requestedDay,
        empID: requestData.empID,
    };
    const dbResponse = await employeeRequestServices_1.employeeRequestServices.create(employeeRequestData);
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
empRequestRouter.post('employee-request', validation_1.validationFunctions.createEmployeeRequestBodyValidationRules(), validation_1.validationFunctions.validationMiddleware, create);
exports.default = empRequestRouter;
