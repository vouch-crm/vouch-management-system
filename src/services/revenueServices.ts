import { revenueDTO, revenueAgent } from "../models/revenueModel";
import { serviceStatuses } from "./enums";

export type revenueReturn = {
    status: string,
    message: string | null,
    data: Record<string, any> | null
}

const create = async(revenueData: revenueDTO): Promise<revenueReturn> => {
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

const getAll = async(): Promise<revenueReturn> => {
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

const del = async(ID: string): Promise<revenueReturn> => {
    try {
        const deletedRevenue = await revenueAgent.findByIdAndDelete(ID);

        if(!deletedRevenue) {
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
    del
}