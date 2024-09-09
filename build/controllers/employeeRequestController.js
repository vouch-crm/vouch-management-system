"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const enums_1 = require("../services/enums");
const employeeRequestServices_1 = require("../services/employeeRequestServices");
const validation_1 = require("../middlewares/validation");
const adminMiddleware_1 = require("../middlewares/adminMiddleware");
const empRequestRouter = express_1.default.Router();
const create = async (req, res) => {
    const requestData = req.body;
    let requestType;
    switch (requestData.type) {
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
        requestedDay: requestData.requestedDay,
        empID: requestData.empID,
        endDate: requestData.endDate,
        notes: requestData.notes,
        startDateFullDay: requestData.startDateFullDay || true,
        endDateFullDay: requestData.endDateFullDay || true
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
const getAll = async (req, res) => {
    const requests = await employeeRequestServices_1.employeeRequestServices.getAll();
    if (requests.status !== enums_1.serviceStatuses.SUCCESS) {
        return res.status(400).json({
            message: requests.message
        });
    }
    res.status(200).json({
        data: requests.data
    });
};
const getByID = async (req, res) => {
    const ID = req.params.id;
    const request = await employeeRequestServices_1.employeeRequestServices.getByID(ID);
    if (request.status === enums_1.serviceStatuses.FAILED) {
        return res.status(404).json({
            message: request.message
        });
    }
    else if (request.status === enums_1.serviceStatuses.ERROR) {
        return res.status(400).json({
            message: request.message
        });
    }
    res.status(200).json({
        data: request.data
    });
};
const getByEmpID = async (req, res) => {
    const ID = req.params.id;
    const request = await employeeRequestServices_1.employeeRequestServices.getByID(ID);
    if (request.status === enums_1.serviceStatuses.FAILED) {
        return res.status(404).json({
            message: request.message
        });
    }
    else if (request.status === enums_1.serviceStatuses.ERROR) {
        return res.status(400).json({
            message: request.message
        });
    }
    res.status(200).json({
        data: request.data
    });
};
const getByIDAndUpdate = async (req, res) => {
    const ID = req.params.id;
    const request = await employeeRequestServices_1.employeeRequestServices.getByIDAndUpdate(ID, req.body);
    if (request.status === enums_1.serviceStatuses.FAILED) {
        return res.status(404).json({
            message: request.message
        });
    }
    else if (request.status === enums_1.serviceStatuses.ERROR) {
        return res.status(400).json({
            message: request.message
        });
    }
    res.status(200).json({
        data: request.data
    });
};
const del = async (req, res) => {
    const ID = req.params.id;
    const request = await employeeRequestServices_1.employeeRequestServices.del(ID);
    if (request.status === enums_1.serviceStatuses.FAILED) {
        return res.status(404).json({
            message: request.message
        });
    }
    else if (request.status === enums_1.serviceStatuses.ERROR) {
        return res.status(400).json({
            message: request.message
        });
    }
    res.status(200).json({
        message: request.message
    });
};
empRequestRouter.post('/employee-request', validation_1.validationFunctions.createEmployeeRequestBodyValidationRules(), validation_1.validationFunctions.validationMiddleware, create);
empRequestRouter.get('/employee-request', adminMiddleware_1.checkIfAdmin, getAll);
empRequestRouter.patch('/employee-request/:id', adminMiddleware_1.checkIfAdmin, getByIDAndUpdate);
// empRequestRouter.get('/employee-request/:id', checkIfAdmin, getByID);
empRequestRouter.get('/employee-request/:id', getByEmpID);
empRequestRouter.delete('/employee-request/:id', adminMiddleware_1.checkIfAdmin, del);
exports.default = empRequestRouter;
