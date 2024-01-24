import express, { Request, Response } from 'express'
import { employeeServices, EmployeeReturn } from '../services/employeeServices'
import { hashingServices } from '../services/hashingServices'
import { EmployeeDocument, EmployeeInput } from '../models/employeeModel'
import { validationFunctions } from '../middlewares/validation'
import { checkIfAdmin } from '../middlewares/adminMiddleware'

const employeeRouter = express.Router();

const create = async (req: Request, res: Response) => {
    const requestData: EmployeeInput = req.body;

    const probationDate = employeeServices.generateProbationDate(requestData.joinDate);
    const password = await hashingServices.hashPassword(
        employeeServices.passwordGenerator(requestData.email));

    const employeeData: EmployeeDocument = requestData;
    employeeData.probationDate = probationDate;
    employeeData.password = password;

    const dbResponse: EmployeeReturn = await employeeServices.create(employeeData);
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
    const dbResponse: EmployeeReturn = await employeeServices.getAll();

    if (dbResponse.status === 'Error') {
        return res.status(400).json({
            message: dbResponse.message
        })
    }

    res.status(200).json({
        data: dbResponse.data
    })
}

const getEmployeeByID = async (req: Request, res: Response) => {
    const ID: string = req.params.id;
    const dbResponse: EmployeeReturn = await employeeServices.getEmployeeByID(ID);

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
        data: dbResponse.data
    })
}

const del = async (req: Request, res: Response) => {
    const id: string = req.params.id;
    const dbResponse: EmployeeReturn = await employeeServices.del(id);

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
    const updatedEmployee = req.body;
    const dbResponse: EmployeeReturn = await employeeServices.update(id, updatedEmployee);

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
    });
}

employeeRouter.post('/employee', validationFunctions.createEmployeeBodyValidationRules(),
    validationFunctions.validationMiddleware, create);
employeeRouter.get('/employee', checkIfAdmin, getAll);
employeeRouter.get('/employee/:id', getEmployeeByID);
employeeRouter.delete('/employee/:id', del);
employeeRouter.put('/employee/:id', update);

export default employeeRouter;