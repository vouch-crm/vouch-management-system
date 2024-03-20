import { TimeSheetEntryAgent } from "../models/timesheetEntryModel";
import { serviceStatuses } from "./enums";

export type dashboardStatsReturn = {
    status: string,
    message: string | null,
    data: any | null
}

const dashboardStats1 = async (startDate: Date, endDate: Date): Promise<dashboardStatsReturn> => {
    try {
        const sectionOneStats = await TimeSheetEntryAgent.aggregate([
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
                    totalTrackedTimeAllTasks: {
                        $sum: '$totalTrackedTime' 
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
                    clientName: 1,
                    totalTrackedTimeAllTasks: 1,
                }
            }
        ]);

        sectionOneStats[0].maxTrackedTime = sectionOneStats[0].maxTrackedTime / 3600
        sectionOneStats[0].totalTrackedTimeAllTasks = sectionOneStats[0].totalTrackedTimeAllTasks / 3600
        return {
            status: serviceStatuses.SUCCESS,
            message: null,
            data: sectionOneStats
        }
    } catch (error) {
        return {
            status: serviceStatuses.ERROR,
            message: `Error fetching dashboard section 1 stats: ${error}`,
            data: null
        }
    }
}

const dashboardStats2 = async (startDate: Date, endDate: Date): Promise<dashboardStatsReturn> => {
    try {
        const sectionTwoStats = await TimeSheetEntryAgent.aggregate([
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
                    totalTrackedSecondsPerDay: {
                        $sum: '$timeTracked'
                    }
                }
            },
            {
                $addFields: {
                    totalTrackedHoursPerDay: {
                        $divide: ['$totalTrackedSecondsPerDay', 3600]
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
                    },
                    color: {
                        $arrayElemAt: ['$task.color', 0]
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    trackedDay: '$_id.trackedDay',
                    taskName: 1,
                    color: 1,
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
            status: serviceStatuses.SUCCESS,
            message: null,
            data: sectionTwoStats
        }
    } catch (error) {
        return {
            status: serviceStatuses.ERROR,
            message: `Error fetching dashboard section 2 stats: ${error}`,
            data: null
        }
    }
}

const dashboardStats3 = async (startDate: Date, endDate: Date): Promise<dashboardStatsReturn> => {
    try {
        const sectionThreeStats = await TimeSheetEntryAgent.aggregate([
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
                    totalSeconds: {
                        $sum: '$timeTracked'
                    }
                }
            },
            {
                $addFields: {
                    totalHours: {
                        $divide: ['$totalSeconds', 3600]
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
            status: serviceStatuses.SUCCESS,
            message: null,
            data: sectionThreeStats
        }
    } catch (error) {
        return {
            status: serviceStatuses.ERROR,
            message: `Error fetching dashboard section3 stats: ${error}`,
            data: null
        }
    }
}

const dashboardStats4 = async (startDate: Date, endDate: Date) => {
    try {
        const sectionFourStats = await TimeSheetEntryAgent.aggregate([
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
                    _id: { employeeID: '$employeeID', taskID: '$taskID' },
                    totalSecondsPerTask: { $sum: '$timeTracked' }
                }
            },
            {
                $addFields: {
                    totalHoursPerTask: {
                        $divide: ['$totalSecondsPerTask', 3600]
                    }
                }
            },
            {
                $lookup: {
                    from: 'tasks',
                    localField: '_id.taskID',
                    foreignField: '_id',
                    as: 'taskData'
                }
            },
            {
                $addFields: {
                    taskName: { $arrayElemAt: ['$taskData.name', 0] }
                }
            },
            {
                $project: {
                    _id: 0,
                    employeeID: '$_id.employeeID',
                    taskID: '$_id.taskID',
                    taskName: 1,
                    totalHoursPerTask: 1
                }
            },
            {
                $group: {
                    _id: '$employeeID',
                    totalHoursByEmployee: { $sum: '$totalHoursPerTask' },
                    tasks: {
                        $push:
                        {
                            taskName: '$taskName',
                            totalHoursPerTask: '$totalHoursPerTask'
                        }
                    }
                }
            },
            {
                $lookup: {
                    from: 'employees',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'employeeData'
                }
            },
            {
                $addFields: {
                    employeeFirstName: {
                        $arrayElemAt: ['$employeeData.firstName', 0]
                    },
                    employeeLastName: {
                        $arrayElemAt: ['$employeeData.lastName', 0]
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    employeeFirstName: 1,
                    employeeLastName: 1,
                    totalHoursByEmployee: 1,
                    tasks: 1
                }
            }
        ]);

        return {
            status: serviceStatuses.SUCCESS,
            message: null,
            data: sectionFourStats
        }
    } catch (error) {
        return {
            status: serviceStatuses.ERROR,
            message: `Error fetching section 4 stats: ${error}`,
            data: null
        }
    }
}

export const dashboardServices = {
    dashboardStats1,
    dashboardStats2,
    dashboardStats3,
    dashboardStats4
}