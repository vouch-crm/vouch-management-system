import { TimeSheetEntryAgent } from "../models/timesheetEntryModel";

const dashboardStats1 = async (startDate: Date, endDate: Date) => {
    try {
        const totalTrackedTime = await TimeSheetEntryAgent.aggregate([
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
                    taskID: 1,
                    taskName: 1,
                    clientName: 1
                }
            }
        ]);
            
        
        return totalTrackedTime;
    } catch (error) {
        throw new Error('Error retrieving total tracked time: ' + error);
    }
}

export const dashboardServices = {
    dashboardStats1
}