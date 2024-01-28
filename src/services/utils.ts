import dotenv from 'dotenv'
import { employeeServices, EmployeeReturn } from './employeeServices';
import { hashingServices } from './hashingServices';
import { EmployeeDocument } from '../models/employeeModel';
import { adminRoles, employmentType } from './enums';

dotenv.config();

const createAdmin = async (): Promise<void> => {
    const firstName = process.env.ADMIN_FIRST_NAME as string;
    const lastName = process.env.ADMIN_LAST_NAME as string;
    const joinDate: Date = new Date();
    const employment = employmentType.FULLTIME;
    const title = 'CEO';
    const email = process.env.ADMIN_EMAIL as string;
    const password = process.env.ADMIN_PASSWORD as string;

    const isAdminExist: EmployeeReturn = await employeeServices.getEmployeeByEmail(email);
    if (isAdminExist.status === 'Success') {
        console.log('we are in the admin exist condition');
        return
    }

    const hashedPassword: string = await hashingServices.hashPassword(password);
    const role: string = adminRoles.SUPERADMIN;
    const adminData: EmployeeDocument = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        joinDate: joinDate,
        password: hashedPassword,
        employmentType: employment,
        title: title,
        role: role
    }
    const dbResponse: EmployeeReturn = await employeeServices.create(adminData);
}

export const utils = {
    createAdmin
}