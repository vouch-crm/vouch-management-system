"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const projectServices_1 = require("../services/projectServices");
const enums_1 = require("../services/enums");
const express_1 = __importDefault(require("express"));
const validation_1 = require("../middlewares/validation");
const projectRouter = express_1.default.Router();
const create = async (req, res) => {
    const { clientID, name, budget } = req.body;
    const projectData = {
        clientID,
        name,
        budget
    };
    const newProject = await projectServices_1.projectServices.create(projectData);
    if (newProject.status !== enums_1.serviceStatuses.SUCCESS) {
        return res.status(400).json({
            message: newProject.message
        });
    }
    res.status(201).json({
        message: newProject.message,
        data: newProject.data
    });
};
const getAll = async (req, res) => {
    const projects = await projectServices_1.projectServices.getAll();
    if (projects.status !== enums_1.serviceStatuses.SUCCESS) {
        return res.status(400).json({
            message: projects.message
        });
    }
    res.status(200).json({
        data: projects.data
    });
};
const getByID = async (req, res) => {
    const ID = req.params.id;
    const project = await projectServices_1.projectServices.getByID(ID);
    if (project.status === enums_1.serviceStatuses.FAILED) {
        return res.status(404).json({
            message: project.message
        });
    }
    else if (project.status === enums_1.serviceStatuses.ERROR) {
        return res.status(400).json({
            message: project.message
        });
    }
    res.status(200).json({
        data: project.data
    });
};
const del = async (req, res) => {
    const ID = req.params.id;
    const deletedProject = await projectServices_1.projectServices.del(ID);
    if (deletedProject.status === enums_1.serviceStatuses.FAILED) {
        return res.status(404).json({
            message: deletedProject.message
        });
    }
    else if (deletedProject.status === enums_1.serviceStatuses.ERROR) {
        return res.status(400).json({
            message: deletedProject.message
        });
    }
    res.status(200).json({
        message: deletedProject.message
    });
};
projectRouter.post('/project', validation_1.validationFunctions.createProjectBodyValidationRules(), validation_1.validationFunctions.validationMiddleware, create);
projectRouter.get('/project', getAll);
projectRouter.get('/project/:id', getByID);
projectRouter.delete('/project/:id', del);
exports.default = projectRouter;
