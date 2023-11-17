"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clientServices = void 0;
const clientModel_1 = require("../models/clientModel");
const create = async (clientData) => {
    try {
        const newClient = await clientModel_1.clientAgent.create(clientData);
        if (newClient) {
            return {
                status: 'success',
                data: newClient
            };
        }
        else {
            return {
                status: 'failed',
                message: 'client document was not created'
            };
        }
    }
    catch (error) {
        return {
            status: 'error',
            message: `an error occurred while creating a client document: ${error}`
        };
    }
};
const update = async (id, clientData) => {
    try {
        const updatedClient = await clientModel_1.clientAgent.findByIdAndUpdate(id, clientData);
        if (!updatedClient) {
            return {
                status: 'failed',
                message: `client with id: ${id} not found`
            };
        }
        else {
            return {
                status: 'success',
                data: updatedClient
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
        const clientDocument = await clientModel_1.clientAgent.findById(id);
        if (clientDocument) {
            return {
                status: 'success',
                data: clientDocument
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
const find = async () => {
    try {
        const clients = await clientModel_1.clientAgent.find();
        if (clients) {
            return {
                status: 'success',
                data: clients
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
exports.clientServices = {
    create,
    update,
    findByID,
    find
};
