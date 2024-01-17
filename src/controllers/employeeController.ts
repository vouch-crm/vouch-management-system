import express, {Request, Response} from 'express'
import { employeeServices, IReturnEmployee } from '../services/employeeServices'
import {IEmployee} from '../models/employeeModel'

const employeeRouter = express.Router();

const create = async (req: Request, res: Response) => {
    const requestData = req.body;

    if (!requestData.joinDate || requestData.joinDate === "") {
        return res.status(400).json({
            'message': 'join date not provided!'
        })
    }
    if (!requestData.email || requestData.email === "") {
        return res.status(400).json({
            'message': 'email not provided!'
        })
    }

    const newEmployee: IEmployee = requestData;
    newEmployee.probationDate = employeeServices.generateProbationDate(newEmployee.joinDate);
    newEmployee.password = employeeServices.passwordGenerator(newEmployee.email);

    const dbResponse: IReturnEmployee = await employeeServices.create(newEmployee);
    if (dbResponse.status === 'Error') {
        return res.status(400).json({
            message: dbResponse.message
        })
    }

    res.status(201).json({
        message: dbResponse.message,
        data: dbResponse.data
    })
}

employeeRouter.post('/employee', create);

export default employeeRouter;