import { jobAgent, IJob } from '../models/jobModel'

export interface IReturnJob {
    status: string,
    message?: string,
    data?: IJob
}

const create = async (jobData: IJob): Promise<IReturnJob> => {
    try {
        const newJob: IJob = await jobAgent.create(jobData);
        if (newJob) {
            return {
                status: 'success',
                data: newJob
            }
        }
        else {
            return {
                status: 'failed',
                message: 'document was not created'
            }
        }
    } catch (error) {
        return {
            status: 'error',
            message: `an error occurred: ${error}`
        }
    }
}

const update = async (id: string, jobData: any): Promise<IReturnJob> => {
    try {
        const query = {
            client: id
        }
        const updatedJob: IJob | null = await jobAgent.findOneAndUpdate(query, jobData, {new: true});
        if (!updatedJob) {
            return {
                status: 'failed',
                message: `client with id: ${id} not found`
            }
        }
        else {
            return {
                status: 'success',
                data: updatedJob
            }
        }
    } catch (error) {
        return {
            status: 'error',
            message: `an error occurred: ${error}`
        }
    }
}

const findByID = async (id: string): Promise<IReturnJob> => {
    try {
        const jobDocument: IJob | null = await jobAgent.findById(id);
        if (jobDocument) {
            return {
                status: 'success',
                data: jobDocument
            }
        }
        else {
            return {
                status: 'failed'
            }
        }
    } catch (error) {
        return {
            status: 'error',
            message: `an error occurred: ${error}`
        }
    }
}

export const jobServices = {
    create,
    update,
    findByID
}