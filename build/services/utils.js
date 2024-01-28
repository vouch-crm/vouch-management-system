"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.utils = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const employeeServices_1 = require("./employeeServices");
const hashingServices_1 = require("./hashingServices");
const enums_1 = require("./enums");
dotenv_1.default.config();
const createAdmin = async () => {
    const firstName = process.env.ADMIN_FIRST_NAME;
    const lastName = process.env.ADMIN_LAST_NAME;
    const joinDate = new Date();
    const employment = enums_1.employmentType.FULLTIME;
    const title = 'CEO';
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;
    const isAdminExist = await employeeServices_1.employeeServices.getEmployeeByEmail(email);
    if (isAdminExist.status === 'Success') {
        console.log('we are in the admin exist condition');
        return;
    }
    const hashedPassword = await hashingServices_1.hashingServices.hashPassword(password);
    const role = enums_1.adminRoles.SUPERADMIN;
    const adminData = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        joinDate: joinDate,
        password: hashedPassword,
        employmentType: employment,
        title: title,
        role: role
    };
    const dbResponse = await employeeServices_1.employeeServices.create(adminData);
};
exports.utils = {
    createAdmin
};
