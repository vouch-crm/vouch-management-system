"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reportsServices_1 = require("../services/reportsServices");
const reportsServices_2 = require("../services/reportsServices");
const enums_1 = require("../services/enums");
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
    try {
        const { clientID } = req.params;
        const thisMonth = new Date().getMonth() + 1;
        const data = await (0, reportsServices_1.getMonthlyCostPerClient)(thisMonth, clientID);
        res.status(200).json(data);
    }
    catch (error) {
        res.status(400);
    }
};
const getClientTotalHoursAndHoursPerDay = async (req, res) => {
    const clientID = req.params.clientID;
    const startDate = new Date(req.params.startDate);
    const endDate = new Date(req.params.endDate);
    const report = await reportsServices_2.reportServices
        .getClientTotalHoursAndHoursPerDay(clientID, startDate, endDate);
    if (report.status !== enums_1.serviceStatuses.SUCCESS) {
        return res.status(400).json({
            message: report.message
        });
    }
    res.status(200).json({
        data: report.data
    });
};
const getEmployeeTotalHoursAndHoursPerDay = async (req, res) => {
    const employeeID = req.params.employeeID;
    const startDate = new Date(req.params.startDate);
    const endDate = new Date(req.params.endDate);
    const report = await reportsServices_2.reportServices
        .getEmployeeTotalHoursAndHoursPerDay(employeeID, startDate, endDate);
    if (report.status !== enums_1.serviceStatuses.SUCCESS) {
        return res.status(400).json({
            message: report.message
        });
    }
    res.status(200).json({
        data: report.data
    });
};
const getClientsTotalHoursByEmployees = async (req, res) => {
    const startDate = new Date(req.params.startDate);
    const endDate = new Date(req.params.endDate);
    const report = await reportsServices_2.reportServices.getClientsTotalHoursByEmployees(startDate, endDate);
    if (report.status !== enums_1.serviceStatuses.SUCCESS) {
        return res.status(400).json({
            message: report.message
        });
    }
    res.status(200).json({
        data: report.data
    });
};
const getEmployeeTotalRevenue = async (req, res) => {
    const startDate = new Date(req.params.startDate);
    const endDate = new Date(req.params.endDate);
    const report = await reportsServices_2.reportServices.getEmployeeTotalRevenue(startDate, endDate);
    if (report.status !== enums_1.serviceStatuses.SUCCESS) {
        return res.status(400).json({
            message: report.message
        });
    }
    res.status(200).json({
        data: report.data
    });
};
const getWeeklyReport = async (req, res) => {
    try {
        const { startDate, endDate } = req.params;
        const sDate = new Date(startDate);
        const eDate = new Date(endDate);
        const data = await (0, reportsServices_1.getWorkHoursForTasks)(sDate, eDate);
        res.status(200).json(data);
    }
    catch (error) {
        res.status(400).json(error);
    }
};
const detailedReports = async (req, res) => {
    try {
        const { pageNumber } = req.query;
        const { startDate, endDate } = req.params;
        const sDate = new Date(startDate);
        const eDate = new Date(endDate);
        const data = await (0, reportsServices_1.getEntriesWithinPeriod)(sDate, eDate, pageNumber ? +pageNumber : 1);
        res.status(200).json(data);
    }
    catch (error) {
        res.status(400).json(error);
    }
};
const projectTotalCost = async (req, res) => {
    const projectID = req.params.projectID;
    const startDate = new Date(req.params.startDate);
    const endDate = new Date(req.params.endDate);
    const ProjectTotalCost = await reportsServices_2.reportServices.getProjectTotalCost(projectID, startDate, endDate);
    if (ProjectTotalCost.status !== enums_1.serviceStatuses.SUCCESS) {
        return res.status(400).json({
            message: ProjectTotalCost.message
        });
    }
    res.status(200).json({
        projectTotalCost: ProjectTotalCost.data
    });
};
reportsRouter.get('/reports-bar/:startDate/:endDate', getBarData);
reportsRouter.get('/client-monthly-cost/:clientID', getClientMonthlyCost);
reportsRouter.get('/report-client/:clientID/:startDate/:endDate', getClientTotalHoursAndHoursPerDay);
reportsRouter.get('/report-employee/:employeeID/:startDate/:endDate', getEmployeeTotalHoursAndHoursPerDay);
reportsRouter.get('/report-client/:startDate/:endDate', getClientsTotalHoursByEmployees);
reportsRouter.get('/report-employee-revenues/:startDate/:endDate', getEmployeeTotalRevenue);
reportsRouter.get('/reports/weekly-report/:startDate/:endDate', getWeeklyReport);
reportsRouter.get('/reports-entries/:startDate/:endDate', detailedReports);
reportsRouter.get('/project-total-cost/:projectID/:startDate/:endDate', projectTotalCost);
exports.default = reportsRouter;
