import { EmployeeTrainingDocument, EmployeeTrainingAgent } from "../models/employeeTraining";
import { serviceStatuses } from "./enums";

export type employeeTrainingReturn = {
    status: string,
    message: string | null,
    data: Record<string, any> | null
}

const create = async (
    trainingData: EmployeeTrainingDocument): Promise<employeeTrainingReturn> => {
    try {
        const newTraining: EmployeeTrainingDocument = await EmployeeTrainingAgent.create(
            trainingData
        );

        return {
            status: serviceStatuses.SUCCESS,
            message: 'training data has been recorded!',
            data: newTraining
        }
    } catch (error) {
        return {
            status: serviceStatuses.ERROR,
            message: `Error creating training data: ${error}`,
            data: null
        }
    }
}

const getAll = async (): Promise<employeeTrainingReturn> => {
    try {
        const trainings: EmployeeTrainingDocument[] = await EmployeeTrainingAgent.find();
        return {
            status: serviceStatuses.SUCCESS,
            message: null,
            data: trainings
        }
    } catch (error) {
        return {
            status: serviceStatuses.ERROR,
            message: `Error getting trainings: ${error}`,
            data: null
        }
    }
}

const getByID = async (ID: string): Promise<employeeTrainingReturn> => {
    try {
        const deletedTraining: EmployeeTrainingDocument | null = await EmployeeTrainingAgent
            .findById(ID);
        if (!deletedTraining) {
            return {
                status: serviceStatuses.FAILED,
                message: `No matching training data for ID = ${ID}`,
                data: null
            }
        }

        return {
            status: serviceStatuses.SUCCESS,
            message: null,
            data: deletedTraining
        }
    } catch (error) {
        return {
            status: serviceStatuses.ERROR,
            message: `Error getting training data: ${error}`,
            data: null
        }
    }
}

const update = async (id: string, salaryData: Record<string, any>): Promise<employeeTrainingReturn> => {
    try {
        const updatedTraining = await EmployeeTrainingAgent.findByIdAndUpdate(id, salaryData, {new: true});

        if (!updatedTraining) {
            return {
                status: serviceStatuses.FAILED,
                message: `Could not find training data with ID: ${id}`,
                data: null
            }
        }

        return {
            status: serviceStatuses.SUCCESS,
            message: `training data updated successfuly!`,
            data: updatedTraining
        }
    } catch (error) {
        return {
            status: serviceStatuses.ERROR,
            message: `Error while updating trianing data: ${error}`,
            data: null
        }
    }
}

const del = async (ID: string): Promise<employeeTrainingReturn> => {
    try {
        const deletedTraining: EmployeeTrainingDocument | null = await EmployeeTrainingAgent
            .findByIdAndDelete(ID);
        if (!deletedTraining) {
            return {
                status: serviceStatuses.FAILED,
                message: `No matching training data for ID = ${ID}`,
                data: null
            }
        }

        return {
            status: serviceStatuses.SUCCESS,
            message: 'training deleted successfuly!',
            data: deletedTraining
        }
    } catch (error) {
        return {
            status: serviceStatuses.ERROR,
            message: `Error deleting training data: ${error}`,
            data: null
        }
    }
}

export const salaryUpdatesServices = {
    create,
    getAll,
    getByID,
    update,
    del
}