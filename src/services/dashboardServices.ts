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
            
        sectionOneStats[0].maxTrackedTime = sectionOneStats[0].maxTrackedTime / 3600
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

const dashboardStats2 = async (startDate: Date, endDate: Date) => {
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

export const dashboardServices = {
    dashboardStats1,
    dashboardStats2
}