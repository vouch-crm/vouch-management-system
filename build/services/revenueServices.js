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
const updateRevenueCellValue = async (ID, monthName, updatedCell) => {
    try {
        const keyName = `months.${monthName}`;
        const updatedRevenue = await revenueModel_1.revenueAgent.findOneAndUpdate({
            _id: ID
        }, {
            $set: {
                [keyName]: updatedCell
            }
        }, {
            new: true
        });
        if (!updatedRevenue) {
            return {
                status: enums_1.serviceStatuses.FAILED,
                message: `No entry found with ID:${ID}`,
                data: null
            };
        }
        return {
            status: enums_1.serviceStatuses.SUCCESS,
            message: 'Cell values updated successfuly!',
            data: null
        };
    }
    catch (error) {
        return {
            status: enums_1.serviceStatuses.ERROR,
            message: `Error updating the revenue cell values: ${error}`,
            data: null
        };
    }
};
const updateConvertedCellValues = async (cellValues) => {
    try {
        const keyname = `months.${cellValues.monthName}`;
        cellValues = await aggregateCellDataValues(cellValues);
        const dbResponse = await revenueModel_1.revenueAgent.findOneAndUpdate({
            clientID: cellValues.clientID,
            type: cellValues.type,
            year: cellValues.year
        }, {
            $set: {
                [keyname]: cellValues.updatedValues
            }
        }, {
            new: true
        });
        if (!dbResponse) {
            await revenueModel_1.revenueAgent.create({
                clientID: cellValues.clientID,
                type: cellValues.type,
                year: cellValues.year,
                months: {
                    [cellValues.monthName]: cellValues.updatedValues
                }
            });
            return {
                status: enums_1.serviceStatuses.SUCCESS,
                message: 'Cell values updated successfuly!',
                data: null
            };
        }
        return {
            status: enums_1.serviceStatuses.SUCCESS,
            message: 'Cell values updated successfuly!',
            data: null
        };
    }
    catch (error) {
        return {
            status: enums_1.serviceStatuses.ERROR,
            message: `Error updating the revenue cell values: ${error}`,
            data: null
        };
    }
};
const aggregateCellDataValues = async (newCellValues) => {
    const { clientID, type, year, monthName } = newCellValues;
    const currentValues = await revenueModel_1.revenueAgent.findOne({
        clientID,
        type,
        year
    });
    if (!currentValues || !currentValues.months[monthName]) {
        return newCellValues;
    }
    newCellValues.updatedValues.retainer +=
        currentValues?.months[monthName].retainer;
    newCellValues.updatedValues.totalBudget +=
        currentValues?.months[monthName].totalBudget;
    if (currentValues.months[monthName].fees) {
        Object.keys(currentValues.months[monthName].fees).forEach(key => {
            if (newCellValues.updatedValues.fees[key]) {
                newCellValues.updatedValues.fees[key] +=
                    currentValues.months[monthName].fees[key];
            }
            else {
                newCellValues.updatedValues.fees[key] =
                    currentValues.months[monthName].fees[key];
            }
        });
    }
    else {
        currentValues.months[monthName].fees = newCellValues.updatedValues.fees;
    }
    if (currentValues.months[monthName].targets) {
        Object.keys(currentValues.months[monthName].targets).forEach(key => {
            if (newCellValues.updatedValues.targets[key]) {
                newCellValues.updatedValues.targets[key] +=
                    currentValues.months[monthName].targets[key];
            }
            else {
                newCellValues.updatedValues.targets[key] =
                    currentValues.months[monthName].targets[key];
            }
        });
    }
    else {
        currentValues.months[monthName].targets = newCellValues.updatedValues.targets;
    }
    return newCellValues;
};
const removeCellData = async (ID, monthName) => {
    try {
        const keyName = `months.${monthName}`;
        const dbResponse = await revenueModel_1.revenueAgent.findOneAndUpdate({
            _id: ID
        }, {
            $unset: {
                [keyName]: ""
            }
        }, {
            new: true
        });
        if (!dbResponse) {
            return {
                status: enums_1.serviceStatuses.FAILED,
                message: `No entry found with ID: ${ID}`,
                data: null
            };
        }
        return {
            status: enums_1.serviceStatuses.SUCCESS,
            message: 'Cell updated successfuly!',
            data: null
        };
    }
    catch (error) {
        return {
            status: enums_1.serviceStatuses.ERROR,
            message: `Error updating cell values: ${error}`,
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
    updateRevenueCellValue,
    updateConvertedCellValues,
    removeCellData,
    del
};
