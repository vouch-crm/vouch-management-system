"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminServices = void 0;
const adminModel_1 = require("../models/adminModel");
const mongodb_1 = require("mongodb");
const enums_1 = require("./enums");
const create = async ({ email, name, password, role = enums_1.adminRoles.ADMIN }) => {
    try {
        const adminData = {
            name: name,
            email: email,
            password: password,
            role: role
        };
        const newAdmin = await adminModel_1.AdminAgent.create(adminData);
        return {
            status: 'Success',
            data: newAdmin,
            message: 'Admin created successfuly!'
        };
    }
    catch (error) {
        if (error instanceof mongodb_1.MongoError && error.code === 11000) {
            return {
                status: 'Error',
                message: `This email: ${email} already exists!`,
                data: null
            };
        }
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
const findByID = async (ID) => {
    try {
        const admin = await adminModel_1.AdminAgent.findById(ID);
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
const del = async (id) => {
    try {
        const deletedAdmin = await adminModel_1.AdminAgent.findByIdAndDelete(id);
        if (!deletedAdmin) {
            return {
                status: 'Failed',
                message: `Admin with ID: ${id} not found`,
                data: null
            };
        }
        return {
            status: 'Success',
            data: deletedAdmin,
            message: 'Admin deleted successfuly!'
        };
    }
    catch (error) {
        return {
            status: 'Error',
            message: `Error deleting admin with id: ${id}: ${error}`,
            data: null
        };
    }
};
exports.adminServices = {
    create,
    findByEmail,
    findByID,
    del
};
