import { AdminDocument, AdminAgent } from '../models/adminModel'

export type AdminReturn = {
    status: string,
    message: string | null,
    data: Record<string, any> | null
}

const create = async (adminData: AdminDocument): Promise<AdminReturn> => {
    try {
        const newAdmin: AdminDocument = await AdminAgent.create(adminData);

        return {
            status: 'Success',
            data: newAdmin,
            message: 'Admin created successfuly!'
        }
    } catch (error) {
        return {
            status: 'Error',
            message: `Error creating an admin: ${error}`,
            data: null
        }
    }
}

const findByEmail = async (email: string): Promise<AdminReturn> => {
    try {
        const admin = await AdminAgent.findOne({ email });

        if (!admin) {
            return {
                status: 'Failed',
                message: `No matching admin`,
                data: null
            }
        }
        return {
            status: 'Success',
            data: admin,
            message: null
        }
    } catch (error) {
        return {
            status: 'Error',
            message: `Error finding an admin: ${error}`,
            data: null
        }
    }
}

const findByID = async (ID: string): Promise<AdminReturn> => {
    try {
        const admin = await AdminAgent.findById(ID);

        if (!admin) {
            return {
                status: 'Failed',
                message: `No matching admin`,
                data: null
            }
        }
        return {
            status: 'Success',
            data: admin,
            message: null
        }
    } catch (error) {
        return {
            status: 'Error',
            message: `Error finding an admin: ${error}`,
            data: null
        }
    }
} 

export const adminServices = {
    create,
    findByEmail,
    findByID
}