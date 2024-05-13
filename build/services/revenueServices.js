"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.revenueServices = void 0;
const revenueModel_1 = require("../models/revenueModel");
const enums_1 = require("./enums");
const create = async (revenueData) => {
    try {
        const newRevenue = await revenueModel_1.revenueAgent.create(revenueData);
        return {
            status: enums_1.serviceStatuses.SUCCESS,
            message: 'Revenue stored successfuly!',
            data: newRevenue
        };
    }
    catch (error) {
        return {
            status: enums_1.serviceStatuses.ERROR,
            message: `Error storing the new revenue: ${error}`,
            data: null
        };
    }
};
const getAll = async () => {
    try {
        const revenues = await revenueModel_1.revenueAgent.find();
        return {
            status: enums_1.serviceStatuses.SUCCESS,
            message: null,
            data: revenues
        };
    }
    catch (error) {
        return {
            status: enums_1.serviceStatuses.ERROR,
            message: `Error getting revenues: ${error}`,
            data: null
        };
    }
};
const del = async (ID) => {
    try {
        const deletedRevenue = await revenueModel_1.revenueAgent.findByIdAndDelete(ID);
        if (!deletedRevenue) {
            return {
                status: enums_1.serviceStatuses.FAILED,
                message: `Revenue entry with ID: ${ID} not found!`,
                data: null
            };
        }
        return {
            status: enums_1.serviceStatuses.SUCCESS,
            message: 'Revenue deleted successfuly!',
            data: null
        };
    }
    catch (error) {
        return {
            status: enums_1.serviceStatuses.ERROR,
            message: `Error deleting revenue: ${error}`,
            data: null
        };
    }
};
exports.revenueServices = {
    create,
    getAll,
    del
};
