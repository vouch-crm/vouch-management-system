import { EmployeeRequestAgent, EmployeeRequestDocument } from "../models/employeeRequests";
import { serviceStatuses } from "./enums";

export type employeeRequestReturn = {
    status: string,
    message: string | null,
    data: Record<string, any> | null
}

const create = async (
    employeeRequestData: EmployeeRequestDocument): Promise<employeeRequestReturn> => {
    try {
        const newRequest: EmployeeRequestDocument = await EmployeeRequestAgent.create(
            employeeRequestData
        );

        return {
            status: serviceStatuses.SUCCESS,
            message: 'Request data has been recorded!',
            data: newRequest
        }
    } catch (error) {
        return {
            status: serviceStatuses.ERROR,
            message: `Error creating an employee request data: ${error}`,
            data: null
        }
    }
}

const getAll = async (): Promise<employeeRequestReturn> => {
    try {
        const requests: EmployeeRequestDocument[] = await EmployeeRequestAgent.find();
        return {
            status: serviceStatuses.SUCCESS,
            message: null,
            data: requests
        }
    } catch (error) {
        return {
            status: serviceStatuses.ERROR,
            message: `Error getting requests: ${error}`,
            data: null
        }
    }
}

const getByID = async (ID: string): Promise<employeeRequestReturn> => {
    try {
        const request: EmployeeRequestDocument | null = await EmployeeRequestAgent.findById(ID);
        if (!request) {
            return {
                status: serviceStatuses.FAILED,
                message: `No matching requests for ID = ${ID}`,
                data: null
            }
        }

        return {
            status: serviceStatuses.SUCCESS,
            message: null,
            data: request
        }
    } catch (error) {
        return {
            status: serviceStatuses.ERROR,
            message: `Error getting request for employee with ID = ${ID} : ${error}`,
            data: null
        }
    }
}

const update = async (
    ID: string, requestData: Record<string, any> ): Promise<employeeRequestReturn> => {
        try {
            const updatedRequest: EmployeeRequestDocument | null = await EmployeeRequestAgent.findByIdAndUpdate(
                ID, requestData, {new: true});
            if (!updatedRequest) {
                return {
                    status: serviceStatuses.FAILED,
                    message: `No matching requests for ID = ${ID}`,
                    data: null
                }
            }

            return {
                status: serviceStatuses.SUCCESS,
                message: 'Request updated successfuly!',
                data: updatedRequest
            }
        } catch (error) {
            return {
                status: serviceStatuses.ERROR,
                message: `Error updating request with ID = ${ID} : ${error}`,
                data: null
            }
        }
    }

const del = async (ID: string): Promise<employeeRequestReturn> => {
    try {
        const deletedRequest: EmployeeRequestDocument | null = await EmployeeRequestAgent.findByIdAndDelete(ID);
        if (!deletedRequest) {
            return {
                status: serviceStatuses.FAILED,
                message: `No matching request for ID = ${ID}`,
                data: null
            }
        }

        return {
            status: serviceStatuses.SUCCESS,
            message: 'Request deleted successfuly!',
            data: deletedRequest
        }
    } catch (error) {
        return {
            status: serviceStatuses.ERROR,
            message: `Error deleting request with ID = ${ID} : ${error}`,
            data: null
        }
    }
}

export const employeeRequestServices = {
    create,
    getAll
}