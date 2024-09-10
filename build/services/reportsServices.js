"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportServices = exports.getWorkHoursForTasks = exports.getEntriesWithinPeriod = exports.getMonthlyCostPerClient = exports.getWorkHoursPerDay = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const timesheetEntryModel_1 = require("../models/timesheetEntryModel");
const enums_1 = require("./enums");
const getWorkHoursPerDay = async (startDate, endDate) => {
    try {
        const data = await timesheetEntryModel_1.TimeSheetEntryAgent.aggregate([
            {
                $match: {
                    trackedDay: {
                        $gte: startDate,
                        $lte: endDate
                    }
                }
            },
            {
                $group: {
                    _id: "$trackedDay",
                    totalSecondsPerDay: {
                        $sum: "$timeTracked"
                    }
                }
            },
            {
                $addFields: {
                    totalHoursPerDay: {
                        $divide: ['$totalSecondsPerDay', 3600]
                    }
                }
            },
            {
                $project: {
                    day: "$_id",
                    totalHoursPerDay: 1,
                    _id: 0
                }
            }
        ]);
        return data;
    }
    catch (error) {
        throw new Error(error);
    }
};
exports.getWorkHoursPerDay = getWorkHoursPerDay;
const getMonthlyCostPerClient = async (month, clientID) => {
    try {
        const financialYear = new Date().getMonth() >= 10 ? `${(new Date().getFullYear()).toString().substring(2)}/${(new Date().getFullYear() + 1).toString().substring(2)}` : `${(new Date().getFullYear() - 1).toString().substring(2)}/${(new Date().getFullYear()).toString().substring(2)}`;
        let actualYear;
        if (month >= 10) {
            const extractedYear = financialYear.substring(0, 2);
            actualYear = +(`${20}${extractedYear}`);
            console.log(`Actual year from Dec, Nov: ${actualYear}`);
        }
        else {
            const extractedYear = financialYear.substring(3, 5);
            actualYear = +(`${20}${extractedYear}`);
            console.log(`Actual year from the rest of the months: ${actualYear}`);
        }
        const data = await timesheetEntryModel_1.TimeSheetEntryAgent.aggregate([
            {
                $match: {
                    clientID: new mongoose_1.default.Types.ObjectId(clientID),
                    trackedDay: {
                        $gte: new Date(actualYear, month - 1, 1),
                        $lt: new Date(actualYear, month, 1)
                    }
                }
            },
            {
                $group: {
                    _id: '$clientID',
                    totalSecondsPerMonth: {
                        $sum: '$timeTracked'
                    },
                    totalCost: {
                        $sum: '$cost'
                    }
                }
            },
            {
                $addFields: {
                    totalHoursPerMonth: {
                        $divide: ['$totalSecondsPerMonth', 3600]
                    }
                }
            },
            {
                $lookup: {
                    from: 'clients',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'client',
                }
            },
            {
                $addFields: {}
            },
            {
                $unwind: '$client'
            },
            {
                $addFields: {
                    clientName: '$client.clientBasicInfo.name'
                }
            },
            {
                $project: {
                    clientName: 1,
                    totalHoursPerMonth: 1,
                    totalCost: 1,
                    _id: 0
                }
            }
        ]);
        return data;
    }
    catch (error) {
        throw new Error(error);
    }
};
exports.getMonthlyCostPerClient = getMonthlyCostPerClient;
const getEntriesWithinPeriod = async (startDate, endDate, pageNumber) => {
    try {
        const PAGE_SIZE = 50;
        const skipCount = (pageNumber - 1) * PAGE_SIZE;
        const entries = await timesheetEntryModel_1.TimeSheetEntryAgent.find({
            trackedDay: {
                $gte: startDate,
                $lte: endDate
            }
        }).populate('taskID', 'name').populate('employeeID', 'firstName lastName').sort({ trackedDay: -1 }).skip(skipCount).limit(PAGE_SIZE).exec();
        const totalTime = entries.map(entry => entry.timeTracked).reduce((acc, cur) => acc + cur, 0) / 3600;
        return { totalTime, entries };
    }
    catch (error) {
        throw new Error(error);
    }
};
exports.getEntriesWithinPeriod = getEntriesWithinPeriod;
const getClientTotalHoursAndHoursPerDay = async (clientID, startDate, endDate) => {
    try {
        const report = await timesheetEntryModel_1.TimeSheetEntryAgent.aggregate([
            {
                $match: {
                    trackedDay: {
                        $gte: startDate,
                        $lte: endDate
                    },
                    clientID: new mongoose_1.default.Types.ObjectId(clientID)
                }
            },
            {
                $group: {
                    _id: {
                        trackedDay: '$trackedDay',
                    },
                    totalTimeTrackedInSecondsPerDay: {
                        $sum: '$timeTracked'
                    },
                    clientID: {
                        $first: '$clientID'
                    }
                }
            },
            {
                $addFields: {
                    totalTimeTrackedInHoursPerDay: {
                        $divide: ['$totalTimeTrackedInSecondsPerDay', 3600]
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    trackedDay: '$_id.trackedDay',
                    clientID: '$clientID',
                    totalTimeTrackedInHoursPerDay: 1
                }
            },
            {
                $sort: {
                    trackedDay: 1
                }
            },
            {
                $group: {
                    _id: null,
                    totalTimeTrackedInHours: {
                        $sum: '$totalTimeTrackedInHoursPerDay'
                    },
                    report: {
                        $push: '$$ROOT'
                    }
                }
            },
            {
                $lookup: {
                    from: 'clients',
                    localField: 'report.clientID',
                    foreignField: '_id',
                    as: 'client'
                }
            },
            {
                $addFields: {
                    clientName: {
                        $arrayElemAt: ['$client.clientBasicInfo.name', 0]
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    clientName: 1,
                    totalTimeTrackedInHours: 1,
                    report: 1
                }
            }
        ]);
        return {
            status: enums_1.serviceStatuses.SUCCESS,
            message: null,
            data: report
        };
    }
    catch (error) {
        return {
            status: enums_1.serviceStatuses.ERROR,
            message: `${error}`,
            data: null
        };
    }
};
const getEmployeeTotalHoursAndHoursPerDay = async (employeeID, startDate, endDate) => {
    try {
        const report = await timesheetEntryModel_1.TimeSheetEntryAgent.aggregate([
            {
                $match: {
                    trackedDay: {
                        $gte: startDate,
                        $lte: endDate
                    },
                    employeeID: new mongoose_1.default.Types.ObjectId(employeeID)
                }
            },
            {
                $group: {
                    _id: {
                        trackedDay: '$trackedDay',
                    },
                    totalTimeTrackedInSecondsPerDay: {
                        $sum: '$timeTracked'
                    },
                    employeeID: {
                        $first: '$employeeID'
                    }
                }
            },
            {
                $addFields: {
                    totalTimeTrackedInHoursPerDay: {
                        $divide: ['$totalTimeTrackedInSecondsPerDay', 3600]
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    trackedDay: '$_id.trackedDay',
                    employeeID: '$employeeID',
                    totalTimeTrackedInHoursPerDay: 1
                }
            },
            {
                $sort: {
                    trackedDay: 1
                }
            },
            {
                $group: {
                    _id: null,
                    totalTimeTrackedInHours: {
                        $sum: '$totalTimeTrackedInHoursPerDay'
                    },
                    report: {
                        $push: '$$ROOT'
                    }
                }
            },
            {
                $lookup: {
                    from: 'employees',
                    localField: 'report.employeeID',
                    foreignField: '_id',
                    as: 'employee'
                }
            },
            {
                $addFields: {
                    employeeFirstName: {
                        $arrayElemAt: ['$employee.firstName', 0]
                    },
                    employeeLastName: {
                        $arrayElemAt: ['$employee.lastName', 0]
                    },
                }
            },
            {
                $project: {
                    _id: 0,
                    totalTimeTrackedInHours: 1,
                    employeeFirstName: 1,
                    employeeLastName: 1,
                    report: 1
                }
            }
        ]);
        return {
            status: enums_1.serviceStatuses.SUCCESS,
            message: null,
            data: report
        };
    }
    catch (error) {
        return {
            status: enums_1.serviceStatuses.ERROR,
            message: `${error}`,
            data: null
        };
    }
};
const getClientsTotalHoursByEmployees = async (startDate, endDate) => {
    try {
        const report = await timesheetEntryModel_1.TimeSheetEntryAgent.aggregate([
            {
                $match: {
                    trackedDay: {
                        $gte: startDate,
                        $lte: endDate
                    }
                }
            },
            {
                $group: {
                    _id: '$clientID',
                    totalTrackedSecondsPerClient: {
                        $sum: '$timeTracked'
                    },
                }
            },
            {
                $addFields: {
                    totalTrackedHoursPerClient: {
                        $divide: ['$totalTrackedSecondsPerClient', 3600]
                    }
                }
            },
            {
                $lookup: {
                    from: 'clients',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'client'
                }
            },
            {
                $addFields: {
                    clientName: {
                        $arrayElemAt: ['$client.clientBasicInfo.name', 0]
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    clientName: 1,
                    totalTrackedHoursPerClient: 1
                }
            }
        ]);
        return {
            status: enums_1.serviceStatuses.SUCCESS,
            message: null,
            data: report
        };
    }
    catch (error) {
        return {
            status: enums_1.serviceStatuses.ERROR,
            message: `${error}`,
            data: null
        };
    }
};
const getEmployeeTotalRevenue = async (startDate, endDate) => {
    try {
        const report = await timesheetEntryModel_1.TimeSheetEntryAgent.aggregate([
            {
                $match: {
                    trackedDay: {
                        $gte: startDate,
                        $lte: endDate
                    }
                }
            },
            {
                $group: {
                    _id: {
                        employeeID: '$employeeID'
                    },
                    totalRevenue: {
                        $sum: '$cost'
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    employeeID: '$_id.employeeID',
                    totalRevenue: 1
                }
            }
        ]);
        return {
            status: enums_1.serviceStatuses.SUCCESS,
            message: null,
            data: report
        };
    }
    catch (error) {
        return {
            status: enums_1.serviceStatuses.ERROR,
            message: `${error}`,
            data: null
        };
    }
};
const getWorkHoursForTasks = async (startDate, endDate) => {
    try {
        const data = await timesheetEntryModel_1.TimeSheetEntryAgent.aggregate([
            {
                $match: {
                    trackedDay: {
                        $gte: startDate,
                        $lte: endDate
                    }
                }
            },
            {
                $lookup: {
                    from: 'tasks',
                    localField: 'taskID',
                    foreignField: '_id',
                    as: 'task'
                }
            },
            {
                $unwind: '$task'
            },
            {
                $group: {
                    _id: {
                        task: '$task.name',
                        date: '$trackedDay',
                        employeeID: '$employeeID'
                    },
                    totalTimeInSeconds: {
                        $sum: '$timeTracked'
                    },
                    employeeID: {
                        $addToSet: '$employeeID'
                    },
                    clientID: {
                        $first: '$clientID'
                    }
                }
            },
            {
                $addFields: {
                    totalHoursPerDay: {
                        $divide: ['$totalTimeInSeconds', 3600]
                    },
                }
            },
            {
                $project: {
                    _id: 0,
                    task: '$_id.task',
                    date: '$_id.date',
                    totalHoursPerDay: 1,
                    clientID: 1,
                    employeeID: 1
                }
            }
        ]);
        return data;
    }
    catch (error) {
        throw new Error(error);
    }
};
exports.getWorkHoursForTasks = getWorkHoursForTasks;
const getProjectTotalCost = async (projectID, startDate, endDate) => {
    try {
        console.log(typeof projectID);
        const projectTotalCost = await timesheetEntryModel_1.TimeSheetEntryAgent.aggregate([
            {
                $lookup: {
                    from: "tasks",
                    localField: "taskID",
                    foreignField: "_id",
                    as: "taskDetails"
                }
            },
            {
                $unwind: "$taskDetails"
            },
            {
                $match: {
                    "taskDetails.projectID": new mongoose_1.default.Types.ObjectId(projectID),
                    trackedDay: {
                        $gte: startDate,
                        $lte: endDate
                    },
                    billable: true
                }
            },
            {
                $group: {
                    _id: null,
                    totalProjectCost: {
                        $sum: '$cost'
                    },
                }
            },
            {
                $project: {
                    _id: 0,
                    totalProjectCost: 1
                }
            }
        ]);
        return {
            status: enums_1.serviceStatuses.SUCCESS,
            message: null,
            data: projectTotalCost
        };
    }
    catch (error) {
        return {
            status: enums_1.serviceStatuses.SUCCESS,
            message: null,
            data: null
        };
    }
};
exports.reportServices = {
    getClientTotalHoursAndHoursPerDay,
    getEmployeeTotalHoursAndHoursPerDay,
    getClientsTotalHoursByEmployees,
    getEmployeeTotalRevenue,
    getProjectTotalCost
};
