"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.timeSheetEntryServices = void 0;
const timesheetEntryModel_1 = require("../models/timesheetEntryModel");
const enums_1 = require("./enums");
const create = async (timeSheetEntry) => {
    try {
        const newEntry = await timesheetEntryModel_1.TimeSheetEntryAgent.create(timeSheetEntry);
        return {
            status: enums_1.serviceStatuses.SUCCESS,
            message: "New entry has been recorded!",
            data: newEntry
        };
    }
    catch (error) {
        return {
            status: enums_1.serviceStatuses.ERROR,
            message: `Error recording the new entry: ${error}`,
            data: null
        };
    }
};
const getAll = async () => {
    try {
        const entries = await timesheetEntryModel_1.TimeSheetEntryAgent.find();
        return {
            status: enums_1.serviceStatuses.SUCCESS,
            message: null,
            data: entries
        };
    }
    catch (error) {
        return {
            status: enums_1.serviceStatuses.ERROR,
            message: `Error fetching time sheet entries: ${error}`,
            data: null
        };
    }
};
const getByID = async (ID) => {
    try {
        const entry = await timesheetEntryModel_1.TimeSheetEntryAgent.findById(ID);
        if (!entry) {
            return {
                status: enums_1.serviceStatuses.FAILED,
                message: `No entry with ID: ${ID}`,
                data: null
            };
        }
        return {
            status: enums_1.serviceStatuses.SUCCESS,
            message: null,
            data: entry
        };
    }
    catch (error) {
        return {
            status: enums_1.serviceStatuses.ERROR,
            message: `Error fetching entry with ID: ${ID}`,
            data: null
        };
    }
};
const getEntriesWithinPeriod = async (empID, startDate, endDate) => {
    try {
        const entries = await timesheetEntryModel_1.TimeSheetEntryAgent.find({
            trackedDay: { $gte: startDate, $lte: endDate },
            employeeID: empID
        });
        return {
            status: enums_1.serviceStatuses.SUCCESS,
            message: null,
            data: entries
        };
    }
    catch (error) {
        return {
            status: enums_1.serviceStatuses.ERROR,
            message: `Error getting entries: ${error}`,
            data: null
        };
    }
};
const update = async (ID, updatedData) => {
    try {
        const updatedEntry = await timesheetEntryModel_1.TimeSheetEntryAgent.findByIdAndUpdate(ID, updatedData, { new: true });
        if (!updatedEntry) {
            return {
                status: enums_1.serviceStatuses.FAILED,
                message: `No entry with ID: ${ID}`,
                data: null
            };
        }
        return {
            status: enums_1.serviceStatuses.SUCCESS,
            message: 'Entry updated successfuly!',
            data: updatedEntry
        };
    }
    catch (error) {
        return {
            status: enums_1.serviceStatuses.ERROR,
            message: `Error updating entry with ID: ${ID}`,
            data: null
        };
    }
};
const del = async (IDs) => {
    try {
        const deletedEntry = await timesheetEntryModel_1.TimeSheetEntryAgent.deleteMany({
            _id: { $in: IDs }
        });
        if (deletedEntry.deletedCount === 0) {
            return {
                status: enums_1.serviceStatuses.FAILED,
                message: `No entries with IDs: ${IDs}`,
                data: null
            };
        }
        return {
            status: enums_1.serviceStatuses.SUCCESS,
            message: 'Entry deleted successfuly!',
            data: null
        };
    }
    catch (error) {
        return {
            status: enums_1.serviceStatuses.ERROR,
            message: `Error deleting entries with IDs: ${error}`,
            data: null
        };
    }
};
exports.timeSheetEntryServices = {
    create,
    getAll,
    getByID,
    getEntriesWithinPeriod,
    update,
    del
};
