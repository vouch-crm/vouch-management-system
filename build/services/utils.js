"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.utils = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const adminServices_1 = require("./adminServices");
const hashingServices_1 = require("./hashingServices");
const enums_1 = require("./enums");
dotenv_1.default.config();
const createAdmin = async () => {
    const name = process.env.ADMIN_NAME;
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;
    const isAdminExist = await adminServices_1.adminServices.findByEmail(email);
    if (isAdminExist.status === 'Success') {
        console.log('we are in the admin exist condition');
        return;
    }
    const hashedPassword = await hashingServices_1.hashingServices.hashPassword(password);
    const role = enums_1.adminRoles.SUPERADMIN;
    const adminData = {
        name: name,
        email: email,
        password: hashedPassword,
        role: role
    };
    const dbResponse = await adminServices_1.adminServices.create(adminData);
};
exports.utils = {
    createAdmin
};
