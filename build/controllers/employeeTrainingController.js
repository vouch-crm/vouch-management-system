"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const employeeTrainingServices_1 = require("../services/employeeTrainingServices");
const enums_1 = require("../services/enums");
const adminMiddleware_1 = require("../middlewares/adminMiddleware");
const validation_1 = require("../middlewares/validation");
const employeeTrainingRouter = express_1.default.Router();
const create = async (req, res) => {
    const trainingData = req.body;
    const dbResponse = await employeeTrainingServices_1.employeeTrainingServices.create(trainingData);
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
    const trainings = await employeeTrainingServices_1.employeeTrainingServices.getAll();
    if (trainings.status !== enums_1.serviceStatuses.SUCCESS) {
        return res.status(400).json({
            message: trainings.message
        });
    }
    res.status(200).json({
        data: trainings.data
    });
};
const getByID = async (req, res) => {
    const ID = req.params.id;
    const dbResponse = await employeeTrainingServices_1.employeeTrainingServices
        .getByID(ID);
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
        data: dbResponse.data
    });
};
const getEmployeeTraining = async (req, res) => {
    const empID = req.params.id;
    const dbResponse = await employeeTrainingServices_1.employeeTrainingServices.getEmployeeTraining(empID);
    if (dbResponse.status !== enums_1.serviceStatuses.SUCCESS) {
        return res.status(400).json({
            message: dbResponse.message
        });
    }
    res.status(200).json({
        data: dbResponse.data
    });
};
const update = async (req, res) => {
    const ID = req.params.id;
    const updatedTraining = req.body;
    const dbResponse = await employeeTrainingServices_1.employeeTrainingServices.update(ID, updatedTraining);
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
    const dbResponse = await employeeTrainingServices_1.employeeTrainingServices.del(ID);
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
employeeTrainingRouter.post('/employee-training', adminMiddleware_1.checkIfAdmin, validation_1.validationFunctions
    .createTrainingBodyValidationRules(), validation_1.validationFunctions.validationMiddleware, create);
employeeTrainingRouter.get('/employee-training', adminMiddleware_1.checkIfAdmin, getAll);
employeeTrainingRouter.get('/employee-training/:id', adminMiddleware_1.checkIfAdmin, getByID);
employeeTrainingRouter.get('/employee-all-trainings/:id', adminMiddleware_1.checkIfAdmin, getEmployeeTraining);
employeeTrainingRouter.put('/employee-training/:id', adminMiddleware_1.checkIfAdmin, update);
employeeTrainingRouter.delete('/employee-training/:id', adminMiddleware_1.checkIfAdmin, del);
exports.default = employeeTrainingRouter;
