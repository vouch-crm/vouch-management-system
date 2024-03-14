"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dashboardServices_1 = require("../services/dashboardServices");
const express_1 = __importDefault(require("express"));
const dashboradRouter = express_1.default.Router();
const dashboardStats1 = async (req, res) => {
    const startDate = new Date(req.params.startDate);
    const endDate = new Date(req.params.endDate);
    console.log(startDate, endDate);
    const dbResponse = await dashboardServices_1.dashboardServices.dashboardStats1(startDate, endDate);
    res.status(200).json({
        response: dbResponse
    });
};
dashboradRouter.get('/dashboard-stats-1/:startDate/:endDate', dashboardStats1);
exports.default = dashboradRouter;
