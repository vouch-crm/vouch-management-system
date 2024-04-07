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

export const reportServices = {
    getClientTotalHoursAndHoursPerDay,
    getEmployeeTotalHoursAndHoursPerDay,
    getClientsTotalHoursByEmployees,
    getEmployeeTotalRevenue
}