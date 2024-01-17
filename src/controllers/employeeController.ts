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

const getAll = async (req: Request, res: Response) => {
    const dbResponse: IReturnEmployee = await employeeServices.getAll();

    if (dbResponse.status === 'Error') {
        return res.status(400).json({
            message: dbResponse.message
        })
    }

    res.status(200).json({
        data: dbResponse.data
    })
}

const del = async (req: Request, res: Response) => {
    const id: string = req.params.id
    const dbResponse: IReturnEmployee = await employeeServices.del(id)

    if (dbResponse.status === 'Failed') {
        return res.status(404).json({
            message: dbResponse.message
        })
    } else if (dbResponse.status === 'Error') {
        return res.status(400).json({
            message: dbResponse.message
        })
    }

    res.status(200).json({
        message: dbResponse.message
    })
}

employeeRouter.post('/employee', create);
employeeRouter.get('/employee', getAll);
employeeRouter.delete('/employee/:id', del);

export default employeeRouter;