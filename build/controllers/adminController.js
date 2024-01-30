"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const employeeServices_1 = require("../services/employeeServices");
const enums_1 = require("../services/enums");
const adminMiddleware_1 = require("../middlewares/adminMiddleware");
const adminRouter = express_1.default.Router();
const create = async (req, res) => {
    const ID = req.body.id;
    const adminData = {
        role: enums_1.adminRoles.ADMIN
    };
    const dbResponse = await employeeServices_1.employeeServices.update(ID, adminData);
    if (dbResponse.status === enums_1.serviceStatuses.FAILED) {
        return res.status(404).json({
            message: dbResponse.message
        });
    }
    else if (dbResponse.status === enums_1.serviceStatuses.ERROR) {
        return res.status(400).json({
            message: dbResponse.message
        });
    }
    res.status(200).json({
        message: dbResponse.message,
        data: dbResponse.data
    });
};
const del = async (req, res) => {
    const ID = req.params.id;
    const adminData = {
        role: null
    };
    const dbResponse = await employeeServices_1.employeeServices.update(ID, adminData);
    if (dbResponse.status === enums_1.serviceStatuses.FAILED) {
        return res.status(404).json({
            message: dbResponse.message
        });
    }
    else if (dbResponse.status === enums_1.serviceStatuses.ERROR) {
        return res.status(400).json({
            message: dbResponse.message
        });
    }
    res.status(200).json({
        message: dbResponse.message,
        data: dbResponse.data
    });
};
adminRouter.post('/admin', adminMiddleware_1.checkIfSuperadmin, create);
adminRouter.delete('/admin/:id', adminMiddleware_1.checkIfSuperadmin, del);
exports.default = adminRouter;
