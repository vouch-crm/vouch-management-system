"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeSheetTemplateServices = void 0;
const timeSheetTemplate_1 = require("../models/timeSheetTemplate");
const enums_1 = require("./enums");
const create = async (templateData) => {
    try {
        const newTemplate = await timeSheetTemplate_1.TimeSheetTemplateAgent.create(templateData);
        return {
            status: enums_1.serviceStatuses.SUCCESS,
            message: 'Template created successfuly!',
            data: newTemplate
        };
    }
    catch (error) {
        return {
            status: enums_1.serviceStatuses.ERROR,
            message: `Error creating a template: ${error}`,
            data: null
        };
    }
};
const getAll = async () => {
    try {
        const templates = await timeSheetTemplate_1.TimeSheetTemplateAgent.find();
        return {
            status: enums_1.serviceStatuses.SUCCESS,
            message: null,
            data: templates
        };
    }
    catch (error) {
        return {
            status: enums_1.serviceStatuses.ERROR,
            message: `Error getting templates: ${error}`,
            data: null
        };
    }
};
const getByID = async (ID) => {
    try {
        const template = await timeSheetTemplate_1.TimeSheetTemplateAgent.findById(ID);
        if (!template) {
            return {
                status: enums_1.serviceStatuses.FAILED,
                message: `No template matching ID: ${ID}`,
                data: null
            };
        }
        return {
            status: enums_1.serviceStatuses.SUCCESS,
            message: null,
            data: template
        };
    }
    catch (error) {
        return {
            status: enums_1.serviceStatuses.ERROR,
            message: `Error getting template: ${error}`,
            data: null
        };
    }
};
const getByEmployeeID = async (employeeID) => {
    try {
        const templates = await timeSheetTemplate_1.TimeSheetTemplateAgent.find({ employeeID: employeeID });
        return {
            status: enums_1.serviceStatuses.SUCCESS,
            message: null,
            data: templates
        };
    }
    catch (error) {
        return {
            status: enums_1.serviceStatuses.ERROR,
            message: `Error getting templates: ${error}`,
            data: null
        };
    }
};
const del = async (ID) => {
    try {
        const template = await timeSheetTemplate_1.TimeSheetTemplateAgent.findByIdAndDelete(ID);
        if (!template) {
            return {
                status: enums_1.serviceStatuses.FAILED,
                message: `No template matching ID: ${ID}`,
                data: null
            };
        }
        return {
            status: enums_1.serviceStatuses.SUCCESS,
            message: 'Template deleted successfuly!',
            data: null
        };
    }
    catch (error) {
        return {
            status: enums_1.serviceStatuses.ERROR,
            message: `Error deleting template: ${error}`,
            data: null
        };
    }
};
exports.TimeSheetTemplateServices = {
    create,
    getAll,
    getByID,
    getByEmployeeID,
    del
};
