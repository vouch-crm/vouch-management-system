"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jobFormServices = void 0;
const jobFormsModel_1 = require("../models/jobFormsModel");
const clientModel_1 = require("../models/clientModel");
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
const findOne = async (clientID) => {
    try {
        const jobFormData = await jobFormsModel_1.jobFormsAgent.findOne({ client: clientID }).populate('client');
        if (!jobFormData) {
            return {
                status: 'failed',
                message: 'job form document was not created'
            };
        }
        return {
            status: 'success',
            data: jobFormData
        };
    }
    catch (error) {
        return {
            status: 'error',
            message: `an error occurred while creating a job form document: ${error}`
        };
    }
};
const update = async (clientID, jobFormData) => {
    try {
        const query = {
            client: clientID
        };
        const updatedJobForm = await jobFormsModel_1.jobFormsAgent.findOneAndUpdate(query, jobFormData, { new: true });
        if (!updatedJobForm) {
            const clientExistCheck = await clientModel_1.clientAgent.findById(clientID);
            if (!clientExistCheck) {
                return {
                    status: 'failed',
                    message: 'document not found'
                };
            }
            const createdJobForm = await jobFormsModel_1.jobFormsAgent.create(jobFormData);
            return {
                status: 'success',
                data: createdJobForm
            };
        }
        return {
            status: 'success',
            data: updatedJobForm
        };
    }
    catch (error) {
        return {
            status: 'error',
            message: `error occurred while updating job form document: ${error}`
        };
    }
};
exports.jobFormServices = {
    create,
    update,
    findOne
};
