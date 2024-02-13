"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.salaryUpdatesServices = void 0;
const salaryUpdatesModel_1 = require("../models/salaryUpdatesModel");
const enums_1 = require("./enums");
const create = async (salaryData) => {
    try {
        const newSalary = await salaryUpdatesModel_1.SalaryUpdatesAgent.create(salaryData);
        return {
            status: enums_1.serviceStatuses.SUCCESS,
            message: 'salary data has been recorded!',
            data: newSalary
        };
    }
    catch (error) {
        return {
            status: enums_1.serviceStatuses.ERROR,
            message: `Error creating salary data: ${error}`,
            data: null
        };
    }
};
const getAll = async () => {
    try {
        const salaries = await salaryUpdatesModel_1.SalaryUpdatesAgent.find();
        return {
            status: enums_1.serviceStatuses.SUCCESS,
            message: null,
            data: salaries
        };
    }
    catch (error) {
        return {
            status: enums_1.serviceStatuses.ERROR,
            message: `Error getting salaries: ${error}`,
            data: null
        };
    }
};
const update = async (id, salaryData) => {
    try {
        const updatedSalary = await salaryUpdatesModel_1.SalaryUpdatesAgent.findByIdAndUpdate(id, salaryData, { new: true });
        if (!updatedSalary) {
            return {
                status: enums_1.serviceStatuses.FAILED,
                message: `Could not find salary data with ID: ${id}`,
                data: null
            };
        }
        return {
            status: enums_1.serviceStatuses.SUCCESS,
            message: `salary data updated successfuly!`,
            data: updatedSalary
        };
    }
    catch (error) {
        return {
            status: enums_1.serviceStatuses.ERROR,
            message: `Error while updating salary data: ${error}`,
            data: null
        };
    }
};
const del = async (ID) => {
    try {
        const deletedSalary = await salaryUpdatesModel_1.SalaryUpdatesAgent.findByIdAndDelete(ID);
        if (!deletedSalary) {
            return {
                status: enums_1.serviceStatuses.FAILED,
                message: `No matching salary data for ID = ${ID}`,
                data: null
            };
        }
        return {
            status: enums_1.serviceStatuses.SUCCESS,
            message: 'salary deleted successfuly!',
            data: deletedSalary
        };
    }
    catch (error) {
        return {
            status: enums_1.serviceStatuses.ERROR,
            message: `Error deleting salary data with ID = ${ID} : ${error}`,
            data: null
        };
    }
};
exports.salaryUpdatesServices = {
    create,
    getAll,
    update,
    del
};
