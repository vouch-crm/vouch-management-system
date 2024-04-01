"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reportsServices_1 = require("../services/reportsServices");
const reportsRouter = (0, express_1.Router)();
const getBarData = async (req, res) => {
    try {
        const { startDate, endDate } = req.params;
        const sDate = new Date(startDate);
        const eDate = new Date(endDate);
        const data = await (0, reportsServices_1.getWorkHoursPerDay)(sDate, eDate);
        res.status(200).json(data);
    }
    catch (error) {
        res.status(400);
    }
};
const getClientMonthlyCost = async (req, res) => {
    // try {
    const { clientID } = req.params;
    const thisMonth = new Date().getMonth() + 1;
    const data = await (0, reportsServices_1.getMonthlyCostPerClient)(thisMonth, clientID);
    res.status(200).json(data);
    // } catch (error) {
    //     res.status(400)
    // }
};
reportsRouter.get('/reports-bar/:startDate/:endDate', getBarData);
reportsRouter.get('/client-monthly-cost/:clientID', getClientMonthlyCost);
exports.default = reportsRouter;
