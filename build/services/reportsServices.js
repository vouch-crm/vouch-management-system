"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportServices = exports.getMonthlyCostPerClient = exports.getWorkHoursPerDay = void 0;
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
        const data = await timesheetEntryModel_1.TimeSheetEntryAgent.aggregate([
            {
                $match: {
                    clientID: new mongoose_1.default.Types.ObjectId(clientID),
                    trackedDay: {
                        $gte: new Date(new Date().getFullYear(), month - 1, 1),
                        $lt: new Date(new Date().getFullYear(), month, 1)
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
                        // clientID: '$clientID'
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
exports.reportServices = {
    getClientTotalHoursAndHoursPerDay,
    getEmployeeTotalHoursAndHoursPerDay,
    getEmployeeTotalRevenue
};
