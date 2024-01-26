"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.employeeRequestServices = void 0;
const employeeRequests_1 = require("../models/employeeRequests");
const enums_1 = require("./enums");
const create = async (employeeRequestData) => {
    try {
        const newRequest = await employeeRequests_1.EmployeeRequestAgent.create(employeeRequestData);
        return {
            status: enums_1.serviceStatuses.SUCCESS,
            message: 'Request data has been recorded!',
            data: newRequest
        };
    }
    catch (error) {
        return {
            status: enums_1.serviceStatuses.ERROR,
            message: `Error creating an employee request data: ${error}`,
            data: null
        };
    }
};
const getAll = async () => {
    try {
        const requests = await employeeRequests_1.EmployeeRequestAgent.find();
        return {
            status: enums_1.serviceStatuses.SUCCESS,
            message: null,
            data: requests
        };
    }
    catch (error) {
        return {
            status: enums_1.serviceStatuses.ERROR,
            message: `Error getting requests: ${error}`,
            data: null
        };
    }
};
const getByID = async (ID) => {
    try {
        const request = await employeeRequests_1.EmployeeRequestAgent.findById(ID);
        if (!request) {
            return {
                status: enums_1.serviceStatuses.FAILED,
                message: `No matching requests for ID = ${ID}`,
                data: null
            };
        }
        return {
            status: enums_1.serviceStatuses.SUCCESS,
            message: null,
            data: request
        };
    }
    catch (error) {
        return {
            status: enums_1.serviceStatuses.ERROR,
            message: `Error getting request for employee with ID = ${ID} : ${error}`,
            data: null
        };
    }
};
const update = async (ID, requestData) => {
    try {
        const updatedRequest = await employeeRequests_1.EmployeeRequestAgent.findByIdAndUpdate(ID, requestData, { new: true });
        if (!updatedRequest) {
            return {
                status: enums_1.serviceStatuses.FAILED,
                message: `No matching requests for ID = ${ID}`,
                data: null
            };
        }
        return {
            status: enums_1.serviceStatuses.SUCCESS,
            message: 'Request updated successfuly!',
            data: updatedRequest
        };
    }
    catch (error) {
        return {
            status: enums_1.serviceStatuses.ERROR,
            message: `Error updating request with ID = ${ID} : ${error}`,
            data: null
        };
    }
};
const del = async (ID) => {
    try {
        const deletedRequest = await employeeRequests_1.EmployeeRequestAgent.findByIdAndDelete(ID);
        if (!deletedRequest) {
            return {
                status: enums_1.serviceStatuses.FAILED,
                message: `No matching request for ID = ${ID}`,
                data: null
            };
        }
        return {
            status: enums_1.serviceStatuses.SUCCESS,
            message: 'Request deleted successfuly!',
            data: deletedRequest
        };
    }
    catch (error) {
        return {
            status: enums_1.serviceStatuses.ERROR,
            message: `Error deleting request with ID = ${ID} : ${error}`,
            data: null
        };
    }
};
exports.employeeRequestServices = {
    create,
    getAll
};
