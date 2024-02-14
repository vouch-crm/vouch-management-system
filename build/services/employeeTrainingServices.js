"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.salaryUpdatesServices = void 0;
const employeeTraining_1 = require("../models/employeeTraining");
const enums_1 = require("./enums");
const create = async (trainingData) => {
    try {
        const newTraining = await employeeTraining_1.EmployeeTrainingAgent.create(trainingData);
        return {
            status: enums_1.serviceStatuses.SUCCESS,
            message: 'training data has been recorded!',
            data: newTraining
        };
    }
    catch (error) {
        return {
            status: enums_1.serviceStatuses.ERROR,
            message: `Error creating training data: ${error}`,
            data: null
        };
    }
};
const getAll = async () => {
    try {
        const trainings = await employeeTraining_1.EmployeeTrainingAgent.find();
        return {
            status: enums_1.serviceStatuses.SUCCESS,
            message: null,
            data: trainings
        };
    }
    catch (error) {
        return {
            status: enums_1.serviceStatuses.ERROR,
            message: `Error getting trainings: ${error}`,
            data: null
        };
    }
};
const getByID = async (ID) => {
    try {
        const deletedTraining = await employeeTraining_1.EmployeeTrainingAgent
            .findById(ID);
        if (!deletedTraining) {
            return {
                status: enums_1.serviceStatuses.FAILED,
                message: `No matching training data for ID = ${ID}`,
                data: null
            };
        }
        return {
            status: enums_1.serviceStatuses.SUCCESS,
            message: null,
            data: deletedTraining
        };
    }
    catch (error) {
        return {
            status: enums_1.serviceStatuses.ERROR,
            message: `Error getting training data: ${error}`,
            data: null
        };
    }
};
const update = async (id, salaryData) => {
    try {
        const updatedTraining = await employeeTraining_1.EmployeeTrainingAgent.findByIdAndUpdate(id, salaryData, { new: true });
        if (!updatedTraining) {
            return {
                status: enums_1.serviceStatuses.FAILED,
                message: `Could not find training data with ID: ${id}`,
                data: null
            };
        }
        return {
            status: enums_1.serviceStatuses.SUCCESS,
            message: `training data updated successfuly!`,
            data: updatedTraining
        };
    }
    catch (error) {
        return {
            status: enums_1.serviceStatuses.ERROR,
            message: `Error while updating trianing data: ${error}`,
            data: null
        };
    }
};
const del = async (ID) => {
    try {
        const deletedTraining = await employeeTraining_1.EmployeeTrainingAgent
            .findByIdAndDelete(ID);
        if (!deletedTraining) {
            return {
                status: enums_1.serviceStatuses.FAILED,
                message: `No matching training data for ID = ${ID}`,
                data: null
            };
        }
        return {
            status: enums_1.serviceStatuses.SUCCESS,
            message: 'training deleted successfuly!',
            data: deletedTraining
        };
    }
    catch (error) {
        return {
            status: enums_1.serviceStatuses.ERROR,
            message: `Error deleting training data: ${error}`,
            data: null
        };
    }
};
exports.salaryUpdatesServices = {
    create,
    getAll,
    getByID,
    update,
    del
};
