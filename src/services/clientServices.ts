import { clientAgent, IClient } from "../models/clientModel";

export interface IReturnClient {
    status: string,
    message?: string,
    data?: IClient
}

const create = async (clientData: IClient): Promise<IReturnClient> => {
    try {
        const newClient: IClient = await clientAgent.create(clientData);
        if (newClient) {
            return {
                status: 'success',
                data: newClient
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

const update = async (id: string, clientData: IClient): Promise<IReturnClient> => {
    try {
        const updatedClient: IClient | null = await clientAgent.findByIdAndUpdate(id, clientData);
        if (!updatedClient) {
            return {
                status: 'failed',
                message: `client with id: ${id} not found`
            }
        }
        else {
            return {
                status: 'success',
                data: updatedClient
            }
        }
    } catch (error) {
        return {
            status: 'error',
            message: `an error occurred: ${error}`
        }
    }
}

const findByID = async (id: string): Promise<IReturnClient> => {
    try {
        const clientDocument: IClient | null = await clientAgent.findById(id);
        if (clientDocument) {
            return {
                status: 'success',
                data: clientDocument
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

export const clientServices = {
    create,
    update,
    findByID
}