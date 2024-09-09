import { EmployeeAgent, EmployeeDocument } from "../models/employeeModel";
import { MongoError } from 'mongodb';
import { adminRoles } from "./enums";

export type EmployeeReturn = {
    status: string,
    message: string | null,
    data: Record<string, any> | null
}

const passwordGenerator = (email: string, password: string): string => {
    const basePassword = email.substring(0, email.indexOf('@'));
    const defaultPassword = `emp-password-${basePassword}`;
    if(password) {
        return password
    }

    return defaultPassword;
}

const generateProbationDate = (joinDate: Date): Date => {
    const newDate = new Date(joinDate);
    newDate.setMonth(newDate.getMonth() + 3)
    return newDate
}

const create = async (employeeData: EmployeeDocument): Promise<EmployeeReturn> => {
    try {
        const newEmployee: EmployeeDocument = await EmployeeAgent.create(employeeData);

        return {
            status: 'Success',
            message: 'Employee Created Successfuly!',
            data: newEmployee
        }

    } catch (error) {
        if (error instanceof MongoError && error.code === 11000) {
            return {
                status: 'Error',
                message: `This email: ${employeeData.email} already exists!`,
                data: null
            }
        }
        return {
            status: 'Error',
            message: `Error creating an employee: ${error}`,
            data: null
        }
    }
}

const getEmployeeByID = async (ID: string): Promise<EmployeeReturn> => {
    try {
        const employee: EmployeeDocument | null = await EmployeeAgent.findById(ID);

        if (!employee) {
            return {
                status: 'Failed',
                message: `Could not find employee with ID: ${ID}`,
                data: null
            }
        }

        return {
            status: 'Success',
            message: null,
            data: employee
        }
    } catch (error) {
        return {
            status: 'Error',
            message: `error getting employee with ID:${ID}: ${error}`,
            data: null
        }
    }
}

const getEmpHourlyRate = async (ID: string): Promise<number | undefined> => {
    const employee = await EmployeeAgent.findById(ID, 'maxCapacityHourlyRate');
    if (!employee) {
        return undefined;
    }
    
    return employee.maxCapacityHourlyRate;
}

const checkEmployeeExist = async (ID: string): Promise<boolean> => {
    try {
        const employee: EmployeeDocument | null = await EmployeeAgent.findById(ID);

        if (!employee) {
            return false;
        }

        return true;
    } catch (error) {
        console.error(`Error checking employee existence: ${error}`);
        return false;
    }
}

const getEmployeeByEmail = async (email: string): Promise<EmployeeReturn> => {
    try {
        const employee: EmployeeDocument | null = await EmployeeAgent.findOne({ email });

        if (!employee) {
            return {
                status: 'Failed',
                message: `Could not find employee with email: ${email}`,
                data: null
            }
        }

        return {
            status: 'Success',
            message: null,
            data: employee
        }
    } catch (error) {
        return {
            status: 'Error',
            message: `error getting employee with email:${email}: ${error}`,
            data: null
        }
    }
}

const getAll = async (): Promise<EmployeeReturn> => {
    try {
        const employees: EmployeeDocument[] = await EmployeeAgent.find();

        return {
            status: 'Success',
            data: employees,
            message: null
        }
    } catch (error) {
        return {
            status: 'Error',
            message: `Error getting all employees: ${error}`,
            data: null
        }
    }
}

const del = async (id: string): Promise<EmployeeReturn> => {
    try {
        const employee: EmployeeDocument | null = await EmployeeAgent.findById(id);
        if (!employee) {
            return {
                status: 'Failed',
                message: `Employee with ID: ${id} not found`,
                data: null
            };
        }

        if (employee.role === adminRoles.ADMIN || employee.role === adminRoles.SUPERADMIN) {
            return {
                status: 'Error',
                message: 'Unauthorized admin deletion!',
                data: null
            };
        }

        const deletedEmployee: EmployeeDocument | null = await
            EmployeeAgent.findByIdAndDelete(id);

        return {
            status: 'Success',
            data: deletedEmployee,
            message: 'Employee deleted successfuly!'
        };
    } catch (error) {
        return {
            status: 'Error',
            message: `Error deleting employee with id: ${id}: ${error}`,
            data: null
        };
    }
}

const update = async (id: string, employeeData: Record<string, any>): Promise<EmployeeReturn> => {
    try {
        const updatedEmployee = await EmployeeAgent.findByIdAndUpdate(id, employeeData, { new: true });

        if (!updatedEmployee) {
            return {
                status: 'Failed',
                message: `Could not find an employee with ID: ${id}`,
                data: null
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
            message: `Error while updating employee with ID: ${id}: ${error}`,
            data: null
        }
    }
}

const updateByEmail = async (email: string, newPassword: string): Promise<EmployeeReturn> => {
    try {
        const updatedEmployee = await EmployeeAgent.findOneAndUpdate(
            { email: email }, 
            { password: newPassword }, 
            { new: true } 
        );
    
        if (!updatedEmployee) {
            return {
                status: 'Failed',
                message: `Could not find an employee with email: ${email}`,
                data: null
            };
        }
    
        return {
            status: 'Success',
            message: `Password updated successfully!`,
            data: updatedEmployee
        };
    } catch (error) {
        return {
            status: 'Error',
            message: `Error while updating password for employee with email: ${email}: ${error}`,
            data: null
        };
    }
    
}

export const employeeServices = {
    passwordGenerator,
    generateProbationDate,
    create,
    getAll,
    del,
    update,
    getEmployeeByID,
    checkEmployeeExist,
    getEmployeeByEmail,
    getEmpHourlyRate,
    updateByEmail
}