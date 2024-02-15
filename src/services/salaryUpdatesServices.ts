import { SalaryUpdatesDocument, SalaryUpdatesAgent } from "../models/salaryUpdatesModel";
import { serviceStatuses } from "./enums";

export type salaryUpdatesReturn = {
    status: string,
    message: string | null,
    data: Record<string, any> | null
}

const create = async (
    salaryData: SalaryUpdatesDocument): Promise<salaryUpdatesReturn> => {
    try {
        const newSalary: SalaryUpdatesDocument = await SalaryUpdatesAgent.create(
            salaryData
        );

        return {
            status: serviceStatuses.SUCCESS,
            message: 'salary data has been recorded!',
            data: newSalary
        }
    } catch (error) {
        return {
            status: serviceStatuses.ERROR,
            message: `Error creating salary data: ${error}`,
            data: null
        }
    }
}

const getAll = async (): Promise<salaryUpdatesReturn> => {
    try {
        const salaries: SalaryUpdatesDocument[] = await SalaryUpdatesAgent.find();
        return {
            status: serviceStatuses.SUCCESS,
            message: null,
            data: salaries
        }
    } catch (error) {
        return {
            status: serviceStatuses.ERROR,
            message: `Error getting salaries: ${error}`,
            data: null
        }
    }
}

const getEmployeeSalary = async (empID: string): Promise<salaryUpdatesReturn> => {
    try {
        const employeeSalaries = await SalaryUpdatesAgent.find({empID: empID})
            .populate('empID', 'firstName email title');
        return {
            status: serviceStatuses.SUCCESS,
            message: null,
            data: employeeSalaries
        }
    } catch (error) {
        return {
            status: serviceStatuses.ERROR,
            message: `Error fetching data: ${error}`,
            data: null
        }
    }
}

const update = async (id: string, salaryData: Record<string, any>): Promise<salaryUpdatesReturn> => {
    try {
        const updatedSalary = await SalaryUpdatesAgent.findByIdAndUpdate(id, salaryData, {new: true});

        if (!updatedSalary) {
            return {
                status: serviceStatuses.FAILED,
                message: `Could not find salary data with ID: ${id}`,
                data: null
            }
        }

        return {
            status: serviceStatuses.SUCCESS,
            message: `salary data updated successfuly!`,
            data: updatedSalary
        }
    } catch (error) {
        return {
            status: serviceStatuses.ERROR,
            message: `Error while updating salary data: ${error}`,
            data: null
        }
    }
}

const del = async (ID: string): Promise<salaryUpdatesReturn> => {
    try {
        const deletedSalary: SalaryUpdatesDocument | null = await SalaryUpdatesAgent.findByIdAndDelete(ID);
        if (!deletedSalary) {
            return {
                status: serviceStatuses.FAILED,
                message: `No matching salary data for ID = ${ID}`,
                data: null
            }
        }

        return {
            status: serviceStatuses.SUCCESS,
            message: 'salary deleted successfuly!',
            data: deletedSalary
        }
    } catch (error) {
        return {
            status: serviceStatuses.ERROR,
            message: `Error deleting salary data with ID = ${ID} : ${error}`,
            data: null
        }
    }
}

export const salaryUpdatesServices = {
    create,
    getAll,
    getEmployeeSalary,
    update,
    del
}