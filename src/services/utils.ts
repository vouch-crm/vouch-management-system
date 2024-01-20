import dotenv from 'dotenv'
import { adminServices, IRetrunAdmin } from './adminServices';
import { hashingServices } from './hashingServices';
import {IAdmin} from '../models/adminModel'

dotenv.config();

const createAdmin = async (): Promise<void> => {
    const name = process.env.ADMIN_NAME as string;
    const email = process.env.ADMIN_EMAIL as string;
    const password = process.env.ADMIN_PASSWORD as string;

    const isAdminExist: IRetrunAdmin = await adminServices.findByEmail(email);
    if (isAdminExist.status === 'Success') {
        console.log('we are in the admin exist condition');
        return
    }

    const hashedPassword: string = await hashingServices.hashPassword(password);
    const adminData: IAdmin = {
        name: name,
        email: email,
        password: hashedPassword
    }
    const dbResponse: IRetrunAdmin = await adminServices.create(adminData);
}

export const utils = {
    createAdmin
}