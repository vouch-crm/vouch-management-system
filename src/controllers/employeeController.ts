import express, {Request, Response} from 'express'
import { employeeServices, IReturnEmployee } from '../services/employeeServices'
import { hashingServices } from '../services/hashingServices'
import {IEmployee} from '../models/employeeModel'
import { validationFunctions } from '../middlewares/validation'

const employeeRouter = express.Router();

const create = async (req: Request, res: Response) => {
    const requestData = req.body;

    const newEmployee: IEmployee = requestData;
    newEmployee.probationDate = employeeServices.generateProbationDate(newEmployee.joinDate);
    newEmployee.password = await hashingServices.hashPassword(
        employeeServices.passwordGenerator(newEmployee.email));

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
    const id: string = req.params.id;
    const dbResponse: IReturnEmployee = await employeeServices.del(id);

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

const update = async (req: Request, res: Response) => {
    const id: string = req.params.id;
    const updatedEmployee: IEmployee = req.body;
    const dbResponse: IReturnEmployee = await employeeServices.update(id, updatedEmployee)

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
        message: dbResponse.message,
        data: dbResponse.data
    })
}

employeeRouter.post('/employee', validationFunctions.createEmployeeBodyValidationRules(),
    validationFunctions.validationMiddleware, create);
employeeRouter.get('/employee', getAll);
employeeRouter.delete('/employee/:id', del);
employeeRouter.put('/employee/:id', update);

export default employeeRouter;