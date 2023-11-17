import { jobFormsAgent, IJobForm } from "../models/jobFormsModel";
import { clientAgent, IClient } from "../models/clientModel";

export interface IReturnJobForm {
    status: string,
    data?: IJobForm,
    message?: string,
    client?: string
}

const create = async (jobFormData: IJobForm): Promise<IReturnJobForm> => {
    try {
        const newJobFormEntry: IJobForm = await jobFormsAgent.create(jobFormData);
        if (!newJobFormEntry) {
            return {
                status: 'failed',
                message: 'job form document was not created'
            }
        }
        return {
            status: 'success',
            data: newJobFormEntry
        }
    } catch (error) {
        return {
            status: 'error',
            message: `an error occurred while creating a job form document: ${error}`
        }
    }
}

const findOne = async (clientID: any): Promise<IReturnJobForm> => {
    try {
        const jobFormData: any = await jobFormsAgent.findOne({client: clientID}).populate('client');
        if (!jobFormData) {
            return {
                status: 'failed',
                message: 'job form document was not created'
            }
        }
        return {
            status: 'success',
            data: jobFormData
        }
    } catch (error) {
        return {
            status: 'error',
            message: `an error occurred while creating a job form document: ${error}`
        }
    }
}

const update = async (clientID: string, jobFormData: IJobForm): Promise<IReturnJobForm> => {
    try {
        const query = {
            client: clientID
        }
        const updatedJobForm: IJobForm | null = await jobFormsAgent.findOneAndUpdate(query, jobFormData,
            { new: true });

        if (!updatedJobForm) {
            const clientExistCheck: IClient | null = await clientAgent.findById(clientID);
            if (!clientExistCheck) {
                return {
                    status: 'failed',
                    message: 'document not found'
                }
            }
            const createdJobForm: IJobForm = await jobFormsAgent.create(jobFormData);
            return {
                status: 'success',
                data: createdJobForm
            }  
        }
        return {
            status: 'success',
            data: updatedJobForm
        }
    } catch (error) {
        return {
            status: 'error',
            message: `error occurred while updating job form document: ${error}`
        }
    }
}

export const jobFormServices = {
    create,
    update,
    findOne
}