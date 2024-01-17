"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.employeeServices = void 0;
const employeeModel_1 = require("../models/employeeModel");
const passwordGenerator = (email) => {
    const basePassword = email.substring(0, email.indexOf('@'));
    const defaultPassword = `@${basePassword}123`;
    return defaultPassword;
};
const generateProbationDate = (joinDate) => {
    const newDate = new Date(joinDate);
    newDate.setMonth(newDate.getMonth() + 3);
    return newDate;
};
const create = async (employeeData) => {
    try {
        const newEmployee = await employeeModel_1.employeeAgent.create(employeeData);
        return {
            status: 'Success',
            message: 'Employee Created Successfuly!',
            data: newEmployee
        };
    }
    catch (error) {
        return {
            status: 'Error',
            message: `Error creating an employee: ${error}`
        };
    }
};
const getAll = async () => {
    try {
        const employees = await employeeModel_1.employeeAgent.find();
        return {
            status: 'Success',
            data: employees
        };
    }
    catch (error) {
        return {
            status: 'Error',
            message: `Error getting all employees: ${error}`
        };
    }
};
// delete is a keyword, not allowed as a function name
const del = async (id) => {
    try {
        const deletedEmployee = await employeeModel_1.employeeAgent.findByIdAndDelete(id);
        if (deletedEmployee) {
            return {
                status: 'Success',
                data: deletedEmployee,
                message: 'Employee deleted successfuly!'
            };
        }
        else {
            return {
                status: 'Failed',
                message: `Employee with ID: ${id} not found`
            };
        }
    }
    catch (error) {
        return {
            status: 'Error',
            message: `Error deleting employee with id: ${id}: ${error}`
        };
    }
};
exports.employeeServices = {
    passwordGenerator,
    generateProbationDate,
    create,
    getAll,
    del
};
