import { employeeAgent, IEmployee } from "../models/employeeModel";

export interface IReturnEmployee {
    status: string,
    message?: string,
    data?: IEmployee
}

const passwordGenerator = (email: string): string => {
    const basePassword = email.substring(0, email.indexOf('@'));
    const defaultPassword = `@${basePassword}123`;

    return defaultPassword;
}

const generateProbationDate = (joinDate: Date): Date => {
    const newDate = new Date(joinDate);
    newDate.setMonth(newDate.getMonth() + 3)
    return newDate
}

const create = async (employeeData: IEmployee): Promise<IReturnEmployee> => {
    try {
        const newEmployee: IEmployee = await employeeAgent.create(employeeData);

        return {
            status: 'Success',
            message: 'Employee Created Successfuly!',
            data: newEmployee
        }
        
    } catch (error) {
        return {
            status: 'Error',
            message: `Error creating an employee: ${error}`
        }
    }
}

export const employeeServices = {
    passwordGenerator,
    generateProbationDate,
    create
}