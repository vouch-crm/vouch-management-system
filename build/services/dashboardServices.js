"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardServices = void 0;
const timesheetEntryModel_1 = require("../models/timesheetEntryModel");
const enums_1 = require("./enums");
const dashboardStats1 = async (startDate, endDate) => {
    try {
        const sectionOneStats = await timesheetEntryModel_1.TimeSheetEntryAgent.aggregate([
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
                    _id: '$taskID',
                    totalTrackedTime: {
                        $sum: '$timeTracked'
                    },
                }
            },
            {
                $group: {
                    _id: null,
                    maxTrackedTime: {
                        $max: '$totalTrackedTime'
                    },
                    taskID: {
                        $first: '$_id'
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
                $addFields: {
                    taskName: {
                        $arrayElemAt: ['$task.name', 0]
                    },
                    clientID: {
                        $arrayElemAt: ['$task.client', 0]
                    }
                }
            },
            {
                $lookup: {
                    from: 'clients',
                    localField: 'clientID',
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
                    _id: null,
                    maxTrackedTime: 1,
                    taskName: 1,
                    clientName: 1
                }
            }
        ]);
        sectionOneStats[0].maxTrackedTime = sectionOneStats[0].maxTrackedTime / 3600;
        return {
            status: enums_1.serviceStatuses.SUCCESS,
            message: null,
            data: sectionOneStats
        };
    }
    catch (error) {
        return {
            status: enums_1.serviceStatuses.ERROR,
            message: `Error fetching dashboard section 1 stats: ${error}`,
            data: null
        };
    }
};
const dashboardStats2 = async (startDate, endDate) => {
    try {
        const sectionTwoStats = await timesheetEntryModel_1.TimeSheetEntryAgent.aggregate([
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
                        trackedDay: '$trackedDay',
                        taskID: '$taskID'
                    },
                    totalTrackedHoursPerDay: {
                        $sum: '$timeTracked'
                    }
                }
            },
            {
                $lookup: {
                    from: 'tasks',
                    localField: '_id.taskID',
                    foreignField: '_id',
                    as: 'task'
                }
            },
            {
                $addFields: {
                    taskName: {
                        $arrayElemAt: ['$task.name', 0]
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    trackedDay: '$_id.trackedDay',
                    taskName: 1,
                    totalTrackedHoursPerDay: 1
                }
            },
            {
                $sort: {
                    trackedDay: 1
                }
            }
        ]);
        return {
            status: enums_1.serviceStatuses.SUCCESS,
            message: null,
            data: sectionTwoStats
        };
    }
    catch (error) {
        return {
            status: enums_1.serviceStatuses.ERROR,
            message: `Error fetching dashboard section 2 stats: ${error}`,
            data: null
        };
    }
};
const dashboardStats3 = async (startDate, endDate) => {
    try {
        const sectionThreeStats = await timesheetEntryModel_1.TimeSheetEntryAgent.aggregate([
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
                    _id: '$taskID',
                    totalHours: {
                        $sum: '$timeTracked'
                    }
                }
            },
            {
                $lookup: {
                    from: 'tasks',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'task'
                }
            },
            {
                $addFields: {
                    taskName: {
                        $arrayElemAt: ['$task.name', 0]
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    taskName: 1,
                    totalHours: 1
                }
            }
        ]);
        return {
            status: enums_1.serviceStatuses.SUCCESS,
            message: null,
            data: sectionThreeStats
        };
    }
    catch (error) {
        return {
            status: enums_1.serviceStatuses.ERROR,
            message: `Error fetching dashboard section3 stats: ${error}`,
            data: null
        };
    }
};
exports.dashboardServices = {
    dashboardStats1,
    dashboardStats2,
    dashboardStats3
};
