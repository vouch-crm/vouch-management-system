"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminServices = void 0;
const adminModel_1 = require("../models/adminModel");
const create = async (adminData) => {
    try {
        const newAdmin = await adminModel_1.adminAgent.create(adminData);
        return {
            status: 'Success',
            data: newAdmin,
            message: 'Admin created successfuly!'
        };
    }
    catch (error) {
        return {
            status: 'Error',
            message: `Error creating an admin: ${error}`
        };
    }
};
const findByEmail = async (email) => {
    try {
        const admin = await adminModel_1.adminAgent.findOne({ email });
        if (!admin) {
            return {
                status: 'Failed',
                message: `No matching admin`
            };
        }
        return {
            status: 'Success',
            data: admin
        };
    }
    catch (error) {
        return {
            status: 'Error',
            message: `Error finding an admin: ${error}`
        };
    }
};
exports.adminServices = {
    create,
    findByEmail
};
