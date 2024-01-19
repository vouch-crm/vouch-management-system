"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const employeeServices_1 = require("../services/employeeServices");
const hashingServices_1 = require("../services/hashingServices");
const validation_1 = require("../middlewares/validation");
const employeeRouter = express_1.default.Router();
const create = async (req, res) => {
    const requestData = req.body;
    const newEmployee = requestData;
    newEmployee.probationDate = employeeServices_1.employeeServices.generateProbationDate(newEmployee.joinDate);
    newEmployee.password = await hashingServices_1.hashingServices.hashPassword(employeeServices_1.employeeServices.passwordGenerator(newEmployee.email));
    const dbResponse = await employeeServices_1.employeeServices.create(newEmployee);
    if (dbResponse.status === 'Error') {
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
    const dbResponse = await employeeServices_1.employeeServices.getAll();
    if (dbResponse.status === 'Error') {
        return res.status(400).json({
            message: dbResponse.message
        });
    }
    res.status(200).json({
        data: dbResponse.data
    });
};
const del = async (req, res) => {
    const id = req.params.id;
    const dbResponse = await employeeServices_1.employeeServices.del(id);
    if (dbResponse.status === 'Failed') {
        return res.status(404).json({
            message: dbResponse.message
        });
    }
    else if (dbResponse.status === 'Error') {
        return res.status(400).json({
            message: dbResponse.message
        });
    }
    res.status(200).json({
        message: dbResponse.message
    });
};
const update = async (req, res) => {
    const id = req.params.id;
    const updatedEmployee = req.body;
    const dbResponse = await employeeServices_1.employeeServices.update(id, updatedEmployee);
    if (dbResponse.status === 'Failed') {
        return res.status(404).json({
            message: dbResponse.message
        });
    }
    else if (dbResponse.status === 'Error') {
        return res.status(400).json({
            message: dbResponse.message
        });
    }
    res.status(200).json({
        message: dbResponse.message,
        data: dbResponse.data
    });
};
employeeRouter.post('/employee', validation_1.validationFunctions.createEmployeeBodyValidationRules(), validation_1.validationFunctions.validationMiddleware, create);
employeeRouter.get('/employee', getAll);
employeeRouter.delete('/employee/:id', del);
employeeRouter.put('/employee/:id', update);
exports.default = employeeRouter;
