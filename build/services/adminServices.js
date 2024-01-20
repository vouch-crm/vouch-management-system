"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminServices = void 0;
const adminModel_1 = require("../models/adminModel");
const create = async (adminData) => {
    try {
        const newAdmin = await adminModel_1.AdminAgent.create(adminData);
        return {
            status: 'Success',
            data: newAdmin,
            message: 'Admin created successfuly!'
        };
    }
    catch (error) {
        return {
            status: 'Error',
            message: `Error creating an admin: ${error}`,
            data: null
        };
    }
};
const findByEmail = async (email) => {
    try {
        const admin = await adminModel_1.AdminAgent.findOne({ email });
        if (!admin) {
            return {
                status: 'Failed',
                message: `No matching admin`,
                data: null
            };
        }
        return {
            status: 'Success',
            data: admin,
            message: null
        };
    }
    catch (error) {
        return {
            status: 'Error',
            message: `Error finding an admin: ${error}`,
            data: null
        };
    }
};
exports.adminServices = {
    create,
    findByEmail
};
