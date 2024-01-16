"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jobServices = void 0;
const jobModel_1 = require("../models/jobModel");
const create = async (jobData) => {
    try {
        const newJob = await jobModel_1.jobAgent.create(jobData);
        if (newJob) {
            return {
                status: 'success',
                data: newJob
            };
        }
        else {
            return {
                status: 'failed',
                message: 'document was not created'
            };
        }
    }
    catch (error) {
        return {
            status: 'error',
            message: `an error occurred: ${error}`
        };
    }
};
const update = async (id, jobData) => {
    try {
        console.log('we are in update service');
        console.log(jobData);
        const query = {
            client: id
        };
        const updatedJob = await jobModel_1.jobAgent.findOneAndUpdate(query, jobData, { new: true });
        console.log('the updated document');
        console.log(updatedJob);
        if (!updatedJob) {
            return {
                status: 'failed',
                message: `client with id: ${id} not found`
            };
        }
        else {
            return {
                status: 'success',
                data: updatedJob
            };
        }
    }
    catch (error) {
        return {
            status: 'error',
            message: `an error occurred: ${error}`
        };
    }
};
const findByID = async (id) => {
    try {
        const jobDocument = await jobModel_1.jobAgent.findById(id);
        if (jobDocument) {
            return {
                status: 'success',
                data: jobDocument
            };
        }
        else {
            return {
                status: 'failed'
            };
        }
    }
    catch (error) {
        return {
            status: 'error',
            message: `an error occurred: ${error}`
        };
    }
};
const findOne = async (id) => {
    try {
        const jobDocument = await jobModel_1.jobAgent.findOne({ client: id });
        if (jobDocument) {
            return {
                status: 'success',
                data: jobDocument
            };
        }
        else {
            return {
                status: 'failed'
            };
        }
    }
    catch (error) {
        return {
            status: 'error',
            message: `an error occurred: ${error}`
        };
    }
};
exports.jobServices = {
    create,
    update,
    findByID,
    findOne
};
