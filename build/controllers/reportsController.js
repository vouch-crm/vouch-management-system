"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reportsServices_1 = require("../services/reportsServices");
const reportsServices_2 = require("../services/reportsServices");
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
const getClientTotalHoursAndHoursPerDay = async (req, res) => {
    const clientID = req.params.clientID;
    const startDate = new Date(req.params.startDate);
    const endDate = new Date(req.params.endDate);
    const report = await reportsServices_2.reportServices
        .getClientTotalHoursAndHoursPerDay(clientID, startDate, endDate);
    res.status(200).json({
        data: report
    });
};
const getEmployeeTotalRevenue = async (req, res) => {
    const startDate = new Date(req.params.startDate);
    const endDate = new Date(req.params.endDate);
    const report = await reportsServices_2.reportServices.getEmployeeTotalRevenue(startDate, endDate);
    res.status(200).json({
        data: report
    });
};
reportsRouter.get('/reports-bar/:startDate/:endDate', getBarData);
reportsRouter.get('/client-monthly-cost/:clientID', getClientMonthlyCost);
reportsRouter.get('/report-client/:clientID/:startDate/:endDate', getClientTotalHoursAndHoursPerDay);
reportsRouter.get('/report-employee-revenues/:startDate/:endDate', getEmployeeTotalRevenue);
exports.default = reportsRouter;
