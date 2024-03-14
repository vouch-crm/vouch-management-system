"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dashboardServices_1 = require("../services/dashboardServices");
const express_1 = __importDefault(require("express"));
const enums_1 = require("../services/enums");
const dashboradRouter = express_1.default.Router();
const dashboardStats1 = async (req, res) => {
    const startDate = new Date(req.params.startDate);
    const endDate = new Date(req.params.endDate);
    const sectionOneStats = await dashboardServices_1.dashboardServices.dashboardStats1(startDate, endDate);
    if (sectionOneStats.status !== enums_1.serviceStatuses.SUCCESS) {
        return res.status(400).json({
            message: sectionOneStats.message
        });
    }
    res.status(200).json({
        data: sectionOneStats.data
    });
};
const dashboardStats2 = async (req, res) => {
    const startDate = new Date(req.params.startDate);
    const endDate = new Date(req.params.endDate);
    const sectionOneStats = await dashboardServices_1.dashboardServices.dashboardStats2(startDate, endDate);
    if (sectionOneStats.status !== enums_1.serviceStatuses.SUCCESS) {
        return res.status(400).json({
            message: sectionOneStats.message
        });
    }
    res.status(200).json({
        data: sectionOneStats.data
    });
};
const dashboardStats3 = async (req, res) => {
    const startDate = new Date(req.params.startDate);
    const endDate = new Date(req.params.endDate);
    const sectionOneStats = await dashboardServices_1.dashboardServices.dashboardStats3(startDate, endDate);
    if (sectionOneStats.status !== enums_1.serviceStatuses.SUCCESS) {
        return res.status(400).json({
            message: sectionOneStats.message
        });
    }
    res.status(200).json({
        data: sectionOneStats.data
    });
};
dashboradRouter.get('/dashboard-stats-1/:startDate/:endDate', dashboardStats1);
dashboradRouter.get('/dashboard-stats-2/:startDate/:endDate', dashboardStats2);
dashboradRouter.get('/dashboard-stats-3/:startDate/:endDate', dashboardStats3);
exports.default = dashboradRouter;
