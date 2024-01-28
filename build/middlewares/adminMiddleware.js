"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkIfSuperadmin = exports.checkIfAdmin = void 0;
const employeeServices_1 = require("../services/employeeServices");
const enums_1 = require("../services/enums");
const tokenServices_1 = require("../services/tokenServices");
const checkIfAdmin = async (req, res, next) => {
    const authorizationToken = req.headers.authorization?.split(" ")[1];
    if (!authorizationToken) {
        return res.status(401).json({
            error: "Unauthorized"
        });
    }
    const decodedToken = tokenServices_1.tokenServices.verifyToken(authorizationToken);
    if (decodedToken.status === 'Error') {
        return res.status(400).json({
            message: decodedToken.message
        });
    }
    const adminID = decodedToken.decoded?.id;
    const dbResponse = await employeeServices_1.employeeServices.getEmployeeByID(adminID);
    if (dbResponse.status === 'Failed') {
        return res.status(404).json({
            message: dbResponse.message
        });
    }
    const role = dbResponse.data?.role;
    if (role !== enums_1.adminRoles.ADMIN && role !== enums_1.adminRoles.SUPERADMIN) {
        return res.status(401).json({
            message: 'Unauthorized access!'
        });
    }
    next();
};
exports.checkIfAdmin = checkIfAdmin;
const checkIfSuperadmin = async (req, res, next) => {
    const authorizationToken = req.headers.authorization?.split(" ")[1];
    if (!authorizationToken) {
        return res.status(401).json({
            error: "Unauthorized"
        });
    }
    const decodedToken = tokenServices_1.tokenServices.verifyToken(authorizationToken);
    if (decodedToken.status === 'Error') {
        return res.status(400).json({
            message: decodedToken.message
        });
    }
    const adminID = decodedToken.decoded?.id;
    const dbResponse = await employeeServices_1.employeeServices.getEmployeeByID(adminID);
    if (dbResponse.status === 'Failed') {
        return res.status(404).json({
            message: dbResponse.message
        });
    }
    const role = dbResponse.data?.role;
    if (role !== enums_1.adminRoles.SUPERADMIN) {
        return res.status(401).json({
            error: 'Unauthorized admin access'
        });
    }
    next();
};
exports.checkIfSuperadmin = checkIfSuperadmin;
