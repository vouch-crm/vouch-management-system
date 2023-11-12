import { clientAgent, IClient } from "../models/clientModel";

const addClient = async (clientData: IClient) => {
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

export const clientServices = {
    addClient
}