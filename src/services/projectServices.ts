import { projectDTO, projectAgent } from "../models/projectModel";
import { serviceStatuses } from "./enums";

export type projectReturn = {
    status: string,
    message: string | null,
    data: Record<string, any> | null
}

const create = async (projectData: projectDTO): Promise<projectReturn> => {
    try {
        const newProject = await projectAgent.create(projectData);

        return {
            status: serviceStatuses.SUCCESS,
            message: 'project created successfuly!',
            data: newProject
        }
    } catch (error) {
        return {
            status: serviceStatuses.ERROR,
            message: `Error creating new project: ${error}`,
            data: null
        }
    }
}

const getAll = async (): Promise<projectReturn> => {
    try {
        const projects = await projectAgent.find().populate({ path: 'clientID', select: 'clientBasicInfo.name' });

        return {
            status: serviceStatuses.SUCCESS,
            message: null,
            data: projects
        }
    } catch (error) {
        return {
            status: serviceStatuses.ERROR,
            message: `Error getting projects: ${error}`,
            data: null
        }
    }
}

const getByID = async (ID: string): Promise<projectReturn> => {
    try {
        const project = await projectAgent.findById(ID);

        if (!project) {
            return {
                status: serviceStatuses.FAILED,
                message: 'No project associated with this ID!',
                data: null
            }
        }
        return {
            status: serviceStatuses.SUCCESS,
            message: null,
            data: project
        }

    } catch (error) {
        return {
            status: serviceStatuses.ERROR,
            message: `an error occurred: ${error}`,
            data: null
        }
    }
}

const getProject = async (clientID: string, name: string): Promise<projectReturn> => {
    try {
        const project = await projectAgent.find({clientID, name});

        if (!project) {
            return {
                status: serviceStatuses.FAILED,
                message: 'No project associated with this ID!',
                data: null
            }
        }
        return {
            status: serviceStatuses.SUCCESS,
            message: null,
            data: project
        }

    } catch (error) {
        return {
            status: serviceStatuses.ERROR,
            message: `an error occurred: ${error}`,
            data: null
        }
    }
}

const del = async (ID: string): Promise<projectReturn> => {
    try {
        const deletedProject = await projectAgent.findByIdAndDelete(ID);

        if (!deletedProject) {
            return {
                status: serviceStatuses.FAILED,
                message: `Project with ID: ${ID} not found!`,
                data: null
            }
        }

        return {
            status: serviceStatuses.SUCCESS,
            message: 'Project deleted successfuly!',
            data: null
        }
    } catch (error) {
        return {
            status: serviceStatuses.ERROR,
            message: `Error deleting proejct: ${error}`,
            data: null
        }
    }
}

export const projectServices = {
    create,
    getAll,
    getByID,
    getProject,
    del
}