"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectServices = void 0;
const projectModel_1 = require("../models/projectModel");
const enums_1 = require("./enums");
const create = async (projectData) => {
    try {
        const newProject = await projectModel_1.projectAgent.create(projectData);
        return {
            status: enums_1.serviceStatuses.SUCCESS,
            message: 'project created successfuly!',
            data: newProject
        };
    }
    catch (error) {
        return {
            status: enums_1.serviceStatuses.ERROR,
            message: `Error creating new project: ${error}`,
            data: null
        };
    }
};
const getAll = async () => {
    try {
        const projects = await projectModel_1.projectAgent.find();
        return {
            status: enums_1.serviceStatuses.SUCCESS,
            message: null,
            data: projects
        };
    }
    catch (error) {
        return {
            status: enums_1.serviceStatuses.ERROR,
            message: `Error getting projects: ${error}`,
            data: null
        };
    }
};
const getByID = async (ID) => {
    try {
        const project = await projectModel_1.projectAgent.findById(ID);
        if (!project) {
            return {
                status: enums_1.serviceStatuses.FAILED,
                message: 'No project associated with this ID!',
                data: null
            };
        }
        return {
            status: enums_1.serviceStatuses.SUCCESS,
            message: null,
            data: project
        };
    }
    catch (error) {
        return {
            status: enums_1.serviceStatuses.ERROR,
            message: `an error occurred: ${error}`,
            data: null
        };
    }
};
const del = async (ID) => {
    try {
        const deletedProject = await projectModel_1.projectAgent.findByIdAndDelete(ID);
        if (!deletedProject) {
            return {
                status: enums_1.serviceStatuses.FAILED,
                message: `Project with ID: ${ID} not found!`,
                data: null
            };
        }
        return {
            status: enums_1.serviceStatuses.SUCCESS,
            message: 'Project deleted successfuly!',
            data: null
        };
    }
    catch (error) {
        return {
            status: enums_1.serviceStatuses.ERROR,
            message: `Error deleting proejct: ${error}`,
            data: null
        };
    }
};
exports.projectServices = {
    create,
    getAll,
    getByID,
    del
};
