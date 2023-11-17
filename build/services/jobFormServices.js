"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jobFormServices = void 0;
const jobFormsModel_1 = require("../models/jobFormsModel");
const create = async (jobFormData) => {
    try {
        const newJobFormEntry = await jobFormsModel_1.jobFormsAgent.create(jobFormData);
        if (!newJobFormEntry) {
            return {
                status: 'failed',
                message: 'job form document was not created'
            };
        }
        return {
            status: 'success',
            data: newJobFormEntry
        };
    }
    catch (error) {
        return {
            status: 'error',
            message: `an error occurred while creating a job form document: ${error}`
        };
    }
};
exports.jobFormServices = {
    create
};
