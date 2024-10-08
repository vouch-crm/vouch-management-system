import Mongoose from "mongoose";
import { TimeSheetEntryAgent } from "../models/timesheetEntryModel";
import { serviceStatuses } from "./enums";

export type reportReturn = {
    status: string,
    message: string | null,
    data: any | null
}

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
        const financialYear = new Date().getMonth() >= 10 ? `${(new Date().getFullYear()).toString().substring(2)}/${(new Date().getFullYear() + 1).toString().substring(2)}` : `${(new Date().getFullYear() - 1).toString().substring(2)}/${(new Date().getFullYear()).toString().substring(2)}`
        let actualYear;
        if(month >= 10) {
            const extractedYear = financialYear.substring(0, 2)
            actualYear = +(`${20}${extractedYear}`)
            console.log(`Actual year from Dec, Nov: ${actualYear}`)
        } else {
            const extractedYear = financialYear.substring(3, 5)
            actualYear = +(`${20}${extractedYear}`)
            console.log(`Actual year from the rest of the months: ${actualYear}`)
        }
        
        const data = await TimeSheetEntryAgent.aggregate([
            {
                $match: {
                    clientID: new Mongoose.Types.ObjectId(clientID),
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
        }).populate('taskID', 'name').populate('employeeID', 'firstName lastName').sort({ trackedDay: -1 }).skip(skipCount).limit(PAGE_SIZE).exec()

        const totalTime = entries.map(entry => entry.timeTracked).reduce((acc: any, cur: any) => acc + cur, 0) / 3600


        return { totalTime, entries }
    } catch (error: any) {
        throw new Error(error)
    }
}

const getClientTotalHoursAndHoursPerDay = async (clientID: string,
    startDate: Date, endDate: Date): Promise<reportReturn> => {
    try {
        const report = await TimeSheetEntryAgent.aggregate([
            {
                $match: {
                    trackedDay: {
                        $gte: startDate,
                        $lte: endDate
                    },
                    clientID: new Mongoose.Types.ObjectId(clientID)
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
            status: serviceStatuses.SUCCESS,
            message: null,
            data: report
        };
    } catch (error) {
        return {
            status: serviceStatuses.ERROR,
            message: `${error}`,
            data: null
        }
    }
}

const getEmployeeTotalHoursAndHoursPerDay = async (employeeID: string,
    startDate: Date, endDate: Date): Promise<reportReturn> => {
    try {
        const report = await TimeSheetEntryAgent.aggregate([
            {
                $match: {
                    trackedDay: {
                        $gte: startDate,
                        $lte: endDate
                    },
                    employeeID: new Mongoose.Types.ObjectId(employeeID)
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
            status: serviceStatuses.SUCCESS,
            message: null,
            data: report
        };
    } catch (error) {
        return {
            status: serviceStatuses.ERROR,
            message: `${error}`,
            data: null
        }
    }
}

const getClientsTotalHoursByEmployees = async (
    startDate: Date, endDate: Date): Promise<reportReturn> => {
    try {
        const report = await TimeSheetEntryAgent.aggregate([
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
            status: serviceStatuses.SUCCESS,
            message: null,
            data: report
        }
    } catch (error) {
        return {
            status: serviceStatuses.ERROR,
            message: `${error}`,
            data: null
        }
    }
}

const getEmployeeTotalRevenue = async (startDate: Date, endDate: Date): Promise<reportReturn> => {
    try {
        const report = await TimeSheetEntryAgent.aggregate([
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
            status: serviceStatuses.SUCCESS,
            message: null,
            data: report
        };
    } catch (error) {
        return {
            status: serviceStatuses.ERROR,
            message: `${error}`,
            data: null
        }
    }
}

export const getWorkHoursForTasks = async (startDate: Date, endDate: Date) => {
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
        ])
        return data
    } catch (error: any) {
        throw new Error(error)
    }
}

const getProjectTotalCost = async (projectID: string, startDate: Date, endDate: Date) => {
    try {
        console.log(typeof projectID);
        const projectTotalCost = await TimeSheetEntryAgent.aggregate([
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
                  "taskDetails.projectID": new Mongoose.Types.ObjectId(projectID),
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
                    totalProjectCost:1
                }
              }
        ])

        return {
            status: serviceStatuses.SUCCESS,
            message: null,
            data: projectTotalCost
        }
    } catch (error) {
        return {
            status: serviceStatuses.SUCCESS,
            message: null,
            data: null
        }
    }
}

export const reportServices = {
    getClientTotalHoursAndHoursPerDay,
    getEmployeeTotalHoursAndHoursPerDay,
    getClientsTotalHoursByEmployees,
    getEmployeeTotalRevenue,
    getProjectTotalCost
}