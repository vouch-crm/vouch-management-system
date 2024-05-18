import { revenueDTO, revenueAgent } from "../models/revenueModel";
import { serviceStatuses } from "./enums";

export type revenueReturn = {
    status: string,
    message: string | null,
    data: Record<string, any> | null
}

const create = async (revenueData: revenueDTO): Promise<revenueReturn> => {
    try {
        const newRevenue = await revenueAgent.create(revenueData);

        return {
            status: serviceStatuses.SUCCESS,
            message: 'Revenue stored successfuly!',
            data: newRevenue
        }
    } catch (error) {
        return {
            status: serviceStatuses.ERROR,
            message: `Error storing the new revenue: ${error}`,
            data: null
        }
    }
}

const getAll = async (): Promise<revenueReturn> => {
    try {
        const revenues = await revenueAgent.find();

        return {
            status: serviceStatuses.SUCCESS,
            message: null,
            data: revenues
        }
    } catch (error) {
        return {
            status: serviceStatuses.ERROR,
            message: `Error getting revenues: ${error}`,
            data: null
        }
    }
}

const updateRevenueCellValue = async (ID: string, monthName: string,
    updatedCell: Record<string, any>): Promise<revenueReturn> => {
    try {
        const keyName = `months.${monthName}`;
        const updatedRevenue = await revenueAgent.findOneAndUpdate(
            {
                _id: ID
            },
            {
                $set: {
                    [keyName]: updatedCell
                }
            },
            {
                new: true
            }
        )

        if (!updatedRevenue) {
            return {
                status: serviceStatuses.FAILED,
                message: `No entry found with ID:${ID}`,
                data: null
            }
        }

        return {
            status: serviceStatuses.SUCCESS,
            message: 'Cell values updated successfuly!',
            data: null
        };
    } catch (error) {
        return {
            status: serviceStatuses.ERROR,
            message: `Error updating the revenue cell values: ${error}`,
            data: null
        }
    }
}

const updateConvertedCellValues = async (cellValues: Record<string, any>): Promise<revenueReturn> => {
    try {
        const keyname = `months.${cellValues.monthName}`;
        const dbResponse = await revenueAgent.findOneAndUpdate(
            {
                clientID: cellValues.clientID,
                type: cellValues.type,
                year: cellValues.year
            },
            {
                $set: {
                    [keyname]: cellValues.updatedCell
                }
            },
            {
                new: true
            },
        )

        if (!dbResponse) {
            return {
                status: serviceStatuses.FAILED,
                message: `No entry found with client ID: ${cellValues.clientID}`,
                data: null
            }
        }

        return {
            status: serviceStatuses.SUCCESS,
            message: 'Cell values updated successfuly!',
            data: null
        }

    } catch (error) {
        return {
            status: serviceStatuses.ERROR,
            message: `Error updating the revenue cell values: ${error}`,
            data: null
        }
    }
}

const del = async (ID: string): Promise<revenueReturn> => {
    try {
        const deletedRevenue = await revenueAgent.findByIdAndDelete(ID);

        if (!deletedRevenue) {
            return {
                status: serviceStatuses.FAILED,
                message: `Revenue entry with ID: ${ID} not found!`,
                data: null
            }
        }

        return {
            status: serviceStatuses.SUCCESS,
            message: 'Revenue deleted successfuly!',
            data: null
        }
    } catch (error) {
        return {
            status: serviceStatuses.ERROR,
            message: `Error deleting revenue: ${error}`,
            data: null
        }
    }
}

export const revenueServices = {
    create,
    getAll,
    updateRevenueCellValue,
    updateConvertedCellValues,
    del
}