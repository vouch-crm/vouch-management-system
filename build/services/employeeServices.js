"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.employeeServices = void 0;
const employeeModel_1 = require("../models/employeeModel");
const mongodb_1 = require("mongodb");
const passwordGenerator = (email) => {
    const basePassword = email.substring(0, email.indexOf('@'));
    const defaultPassword = `@${basePassword}`;
    return defaultPassword;
};
const generateProbationDate = (joinDate) => {
    const newDate = new Date(joinDate);
    newDate.setMonth(newDate.getMonth() + 3);
    return newDate;
};
const create = async (employeeData) => {
    try {
        const newEmployee = await employeeModel_1.EmployeeAgent.create(employeeData);
        return {
            status: 'Success',
            message: 'Employee Created Successfuly!',
            data: newEmployee
        };
    }
    catch (error) {
        if (error instanceof mongodb_1.MongoError && error.code === 11000) {
            return {
                status: 'Error',
                message: `This email: ${employeeData.email} already exists!`,
                data: null
            };
        }
        return {
            status: 'Error',
            message: `Error creating an employee: ${error}`,
            data: null
        };
    }
};
const getEmployeeByID = async (ID) => {
    try {
        const employee = await employeeModel_1.EmployeeAgent.findById(ID);
        if (!employee) {
            return {
                status: 'Failed',
                message: `Could not find employee with ID: ${ID}`,
                data: null
            };
        }
        return {
            status: 'Success',
            message: null,
            data: employee
        };
    }
    catch (error) {
        return {
            status: 'Success',
            message: `error getting employee with ID:${ID}: ${error}`,
            data: null
        };
    }
};
const getEmployeeByEmail = async (email) => {
    try {
        const employee = await employeeModel_1.EmployeeAgent.findOne({ email });
        if (!employee) {
            return {
                status: 'Failed',
                message: `Could not find employee with email: ${email}`,
                data: null
            };
        }
        return {
            status: 'Success',
            message: null,
            data: employee
        };
    }
    catch (error) {
        return {
            status: 'Success',
            message: `error getting employee with email:${email}: ${error}`,
            data: null
        };
    }
};
const getAll = async () => {
    try {
        const employees = await employeeModel_1.EmployeeAgent.find();
        return {
            status: 'Success',
            data: employees,
            message: null
        };
    }
    catch (error) {
        return {
            status: 'Error',
            message: `Error getting all employees: ${error}`,
            data: null
        };
    }
};
// delete is a keyword, not allowed as a function name
const del = async (id) => {
    try {
        const deletedEmployee = await employeeModel_1.EmployeeAgent.findByIdAndDelete(id);
        if (!deletedEmployee) {
            return {
                status: 'Failed',
                message: `Employee with ID: ${id} not found`,
                data: null
            };
        }
        return {
            status: 'Success',
            data: deletedEmployee,
            message: 'Employee deleted successfuly!'
        };
    }
    catch (error) {
        return {
            status: 'Error',
            message: `Error deleting employee with id: ${id}: ${error}`,
            data: null
        };
    }
};
const update = async (id, employeeData) => {
    try {
        const updatedEmployee = await employeeModel_1.EmployeeAgent.findByIdAndUpdate(id, employeeData, { new: true });
        if (!updatedEmployee) {
            return {
                status: 'Failed',
                message: `Could not find an employee with ID: ${id}`,
                data: null
            };
        }
        return {
            status: 'Success',
            message: `Employee updated successfuly!`,
            data: updatedEmployee
        };
    }
    catch (error) {
        return {
            status: 'Error',
            message: `Error while updating employee with ID: ${id}: ${error}`,
            data: null
        };
    }
};
exports.employeeServices = {
    passwordGenerator,
    generateProbationDate,
    create,
    getAll,
    del,
    update,
    getEmployeeByID,
    getEmployeeByEmail
};
