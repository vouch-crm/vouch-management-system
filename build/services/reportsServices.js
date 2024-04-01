"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMonthlyCostPerClient = exports.getWorkHoursPerDay = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const timesheetEntryModel_1 = require("../models/timesheetEntryModel");
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
