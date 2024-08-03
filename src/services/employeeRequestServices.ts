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
        const requests: EmployeeRequestDocument[] = await EmployeeRequestAgent.find().populate({path: 'empID', select: 'firstName lastName'});
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

const getByEmpID = async (ID: string): Promise<employeeRequestReturn> => {
    try {
        const request = await EmployeeRequestAgent.find({empID: ID});
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

const getByIDAndUpdate = async (ID: string, data: any): Promise<employeeRequestReturn> => {
    try {
        const request: EmployeeRequestDocument | null = await EmployeeRequestAgent.findByIdAndUpdate(ID, data);
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
    getAll,
    getByID,
    getByEmpID,
    getByIDAndUpdate,
    del
}