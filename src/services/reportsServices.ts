import Mongoose from "mongoose";
import { TimeSheetEntryAgent } from "../models/timesheetEntryModel";

export const getWorkHoursPerDay = async (startDate: Date, endDate: Date) => {
    try {
        const data = await TimeSheetEntryAgent.aggregate([
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
        ])
        return data
    } catch (error: any) {
        throw new Error(error)
    }
}

export const getMonthlyCostPerClient = async (month: number, clientID: string) => {
    try {
        const data = await TimeSheetEntryAgent.aggregate([
            {
                $match: {
                    clientID: new Mongoose.Types.ObjectId(clientID),
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
                $addFields: {

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
        ])
        return data
    } catch (error: any) {
        throw new Error(error)
    }
}

export const getEntriesWithinPeriod = async (startDate: Date, endDate: Date, pageNumber: number) => {
    try {
        const PAGE_SIZE = 50
        const skipCount = (pageNumber - 1) * PAGE_SIZE;
        const entries = await TimeSheetEntryAgent.find({
            trackedDay: {
                $gte: startDate,
                $lte: endDate
            }
        }).populate('taskID', 'name').populate('employeeID', 'firstName lastName').sort({trackedDay: -1}).skip(skipCount).limit(PAGE_SIZE).exec()

        const totalTime = entries.map(entry => entry.timeTracked).reduce((acc: any, cur: any) => acc + cur, 0) / 3600


        return { totalTime, entries }
    } catch (error: any) {
        throw new Error(error)
    }
}