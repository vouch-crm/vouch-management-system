"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminServices_1 = require("../services/adminServices");
const hashingServices_1 = require("../services/hashingServices");
const tokenServices_1 = require("../services/tokenServices");
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
    const passwordChecker = await hashingServices_1.hashingServices.verifyHash(requestData.password, dbResponse.data.password);
    if (!passwordChecker) {
        res.status(400).json({
            message: 'Invalid email or password!'
        });
    }
    const tokenResponse = await tokenServices_1.tokenServices.generateToken(dbResponse.data.id, dbResponse.data.email);
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
adminRouter.post('/admin', login);
exports.default = adminRouter;
