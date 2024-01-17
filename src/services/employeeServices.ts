import { employeeAgent, IEmployee } from "../models/employeeModel";

export interface IReturnEmployee {
    status: string,
    message?: string,
    data?: any
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

const getAll = async (): Promise<IReturnEmployee> => {
    try {
        const employees: IEmployee[] = await employeeAgent.find();

        return {
            status: 'Success',
            data: employees
        }
    } catch (error) {
        return {
            status: 'Error',
            message: `Error getting all employees: ${error}`
        }
    }
}

// delete is a keyword, not allowed as a function name
const del = async (id: string): Promise<IReturnEmployee> => {
    try {
        const deletedEmployee = await employeeAgent.findByIdAndDelete(id);

        if (deletedEmployee) {
            return {
                status: 'Success',
                data: deletedEmployee,
                message: 'Employee deleted successfuly!'
            };
        } else {
            return {
                status: 'Failed',
                message: `Employee with ID: ${id} not found`
            };
        }
    } catch (error) {
        return {
            status: 'Error',
            message: `Error deleting employee with id: ${id}: ${error}`
        };
    }
}

const update = async (id: string, employeeData: IEmployee): Promise<IReturnEmployee> => {
    try {
        const updatedEmployee: IEmployee | null = await employeeAgent.findByIdAndUpdate(id, employeeData, {new: true});

        if (!updatedEmployee) {
            return {
                status: 'Failed',
                message: `Could not find an employee with ID: ${id}`
            }
        }

        return {
            status: 'Success',
            message: `Employee updated successfuly!`,
            data: updatedEmployee
        }
    } catch (error) {
        return {
            status: 'Error',
            message: `Error while updating employee with ID: ${id}: ${error}`
        }
    }
}

export const employeeServices = {
    passwordGenerator,
    generateProbationDate,
    create,
    getAll,
    del,
    update
}