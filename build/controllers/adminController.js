"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminServices_1 = require("../services/adminServices");
const hashingServices_1 = require("../services/hashingServices");
const tokenServices_1 = require("../services/tokenServices");
const enums_1 = require("../services/enums");
const adminMiddleware_1 = require("../middlewares/adminMiddleware");
const adminRouter = express_1.default.Router();
const login = async (req, res) => {
    const requestData = req.body;
    const dbResponse = await adminServices_1.adminServices.findByEmail(requestData.email);
    if (dbResponse.status === 'Failed') {
        return res.status(404).json({
            message: 'Invalid email or password'
        });
    }
    else if (dbResponse.status === 'Error') {
        return res.status(400).json({
            error: dbResponse.message
        });
    }
    const adminPassword = dbResponse.data?.password;
    const passwordChecker = await hashingServices_1.hashingServices.verifyHash(requestData.password, adminPassword);
    if (!passwordChecker) {
        res.status(400).json({
            message: 'Invalid email or password!'
        });
    }
    const adminID = dbResponse.data?.id;
    const adminEmail = dbResponse.data?.email;
    const tokenResponse = await tokenServices_1.tokenServices.generateToken(adminID, adminEmail);
    if (tokenResponse.status === 'Success') {
        res.status(200).json({
            token: tokenResponse.token
        });
    }
    else {
        res.status(400).json({
            message: tokenResponse.message
        });
    }
};
const create = async (req, res) => {
    const requestData = req.body;
    const hashedPassword = await hashingServices_1.hashingServices.hashPassword(requestData.password);
    requestData.password = hashedPassword;
    const dbResponse = await adminServices_1.adminServices.create(requestData);
    if (dbResponse.status !== enums_1.serviceStatuses.SUCCESS) {
        return res.status(400).json({
            error: dbResponse.message
        });
    }
    res.status(201).json({
        message: dbResponse.message,
        data: dbResponse.data
    });
};
const del = async (req, res) => {
    const ID = req.params.id;
    const dbResponse = await adminServices_1.adminServices.del(ID);
    if (dbResponse.status === enums_1.serviceStatuses.FAILED) {
        return res.status(404).json({
            message: dbResponse.message
        });
    }
    else if (dbResponse.status === enums_1.serviceStatuses.ERROR) {
        return res.status(400).json({
            error: dbResponse.message
        });
    }
    res.status(200).json({
        message: 'Admin deleted successfuly!'
    });
};
adminRouter.post('/admin-login', login);
adminRouter.post('/admin', adminMiddleware_1.checkIfSuperadmin, create);
adminRouter.delete('/admin/:id', adminMiddleware_1.checkIfSuperadmin, del);
exports.default = adminRouter;
