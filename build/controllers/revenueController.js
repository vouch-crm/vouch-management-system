"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const revenueServices_1 = require("../services/revenueServices");
const enums_1 = require("../services/enums");
const express_1 = __importDefault(require("express"));
const revenueRouter = express_1.default.Router();
const create = async (req, res) => {
    const requestData = req.body;
    const newRevenue = await revenueServices_1.revenueServices.create(requestData);
    if (newRevenue.status !== enums_1.serviceStatuses.SUCCESS) {
        return res.status(400).json({
            message: newRevenue.message
        });
    }
    res.status(201).json({
        message: newRevenue.message,
        data: newRevenue.data
    });
};
const del = async (req, res) => {
    const ID = req.params.id;
    const deletedRevenue = await revenueServices_1.revenueServices.del(ID);
    if (deletedRevenue.status === enums_1.serviceStatuses.FAILED) {
        return res.status(404).json({
            message: deletedRevenue.message
        });
    }
    else if (deletedRevenue.status === enums_1.serviceStatuses.ERROR) {
        return res.status(400).json({
            message: deletedRevenue.message
        });
    }
    res.status(200).json({
        message: deletedRevenue.message
    });
};
revenueRouter.post('/revenue', create);
revenueRouter.delete('/revenue/:id', del);
exports.default = revenueRouter;
