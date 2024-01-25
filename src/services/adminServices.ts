import { AdminDocument, AdminAgent } from '../models/adminModel'
import { MongoError } from 'mongodb'
import { adminRoles } from './enums'

export type AdminReturn = {
    status: string,
    message: string | null,
    data: Record<string, any> | null
}

const create = async ({ email, name, password, role = adminRoles.ADMIN }: AdminDocument): Promise<AdminReturn> => {
    try {
        const adminData: AdminDocument = {
            name: name,
            email: email,
            password: password,
            role: role
        }
        const newAdmin: AdminDocument = await AdminAgent.create(adminData);

        return {
            status: 'Success',
            data: newAdmin,
            message: 'Admin created successfuly!'
        }
    } catch (error) {
        if (error instanceof MongoError && error.code === 11000) {
            return {
                status: 'Error',
                message: `This email: ${email} already exists!`,
                data: null
            }
        }

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

const del = async (id: string): Promise<AdminReturn> => {
    try {
        const deletedAdmin = await AdminAgent.findByIdAndDelete(id);

        if (!deletedAdmin) {
            return {
                status: 'Failed',
                message: `Admin with ID: ${id} not found`,
                data: null
            };
        }

        return {
            status: 'Success',
            data: deletedAdmin,
            message: 'Admin deleted successfuly!'
        };
    } catch (error) {
        return {
            status: 'Error',
            message: `Error deleting admin with id: ${id}: ${error}`,
            data: null
        };
    }
}

export const adminServices = {
    create,
    findByEmail,
    findByID,
    del
}