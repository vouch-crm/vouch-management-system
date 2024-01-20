import { adminAgent, IAdmin } from '../models/adminModel'

export interface IRetrunAdmin {
    status: string,
    message?: string,
    data?: any
}

const create = async (adminData: IAdmin): Promise<IRetrunAdmin> => {
    try {
        const newAdmin = await adminAgent.create(adminData);

        return {
            status: 'Success',
            data: newAdmin,
            message: 'Admin created successfuly!'
        }
    } catch (error) {
        return {
            status: 'Error',
            message: `Error creating an admin: ${error}`
        }
    }
}

const findByEmail = async (email: string): Promise<IRetrunAdmin> => {
    try {
        const admin = await adminAgent.findOne({ email });

        if (!admin) {
            return {
                status: 'Failed',
                message: `No matching admin`
            }
        }
        return {
            status: 'Success',
            data: admin
        }
    } catch (error) {
        return {
            status: 'Error',
            message: `Error finding an admin: ${error}`
        }
    }
}

export const adminServices = {
    create,
    findByEmail
}