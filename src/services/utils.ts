import dotenv from 'dotenv'
import { adminServices, AdminReturn } from './adminServices';
import { hashingServices } from './hashingServices';
import {AdminDocument} from '../models/adminModel'

dotenv.config();

const createAdmin = async (): Promise<void> => {
    const name = process.env.ADMIN_NAME as string;
    const email = process.env.ADMIN_EMAIL as string;
    const password = process.env.ADMIN_PASSWORD as string;

    const isAdminExist: AdminReturn = await adminServices.findByEmail(email);
    if (isAdminExist.status === 'Success') {
        console.log('we are in the admin exist condition');
        return
    }

    const hashedPassword: string = await hashingServices.hashPassword(password);
    const adminData: AdminDocument = {
        name: name,
        email: email,
        password: hashedPassword
    }
    const dbResponse: AdminReturn = await adminServices.create(adminData);
}

export const utils = {
    createAdmin
}