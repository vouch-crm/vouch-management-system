import express, { Request, Response } from 'express';
import { employeeRequests, serviceStatuses } from '../services/enums';
import { EmployeeRequestDocument } from '../models/employeeRequests';
import { employeeRequestReturn, employeeRequestServices } from '../services/employeeRequestServices';
import { validationFunctions } from '../middlewares/validation';
import { checkIfAdmin } from '../middlewares/adminMiddleware';

const empRequestRouter = express.Router();

const create = async (req: Request, res: Response) => {
    const requestData = req.body;
    let requestType: string;
    switch (requestData.type) {
        case employeeRequests.HOLIDAY:
            requestType = employeeRequests.HOLIDAY;
            break;
        case employeeRequests.SICK:
            requestType = employeeRequests.SICK;
            break;
        case employeeRequests.WORKFROMHOME:
            requestType = employeeRequests.WORKFROMHOME;
            break;
        default:
            return res.status(400).json({
                message: 'Invalid request type'
            });
    }

    const employeeRequestData: EmployeeRequestDocument = {
        type: requestData.type,
        requestedDay: requestData.requestedDay,
        empID: requestData.empID,
        endDate: requestData.endDate,
        notes: requestData.notes,
        startDateFullDay: requestData.startDateFullDay || true,
        endDateFullDay: requestData.endDateFullDay || true       
    }
    const dbResponse: employeeRequestReturn = await 
        employeeRequestServices.create(employeeRequestData);
    
    if (dbResponse.status !== serviceStatuses.SUCCESS) {
        return res.status(400).json({
            message: dbResponse.message
        });
    }

    res.status(201).json({
        message: dbResponse.message,
        data: dbResponse.data
    });
}

const getAll = async (req: Request, res: Response) => {
    const requests: employeeRequestReturn = await employeeRequestServices.getAll();
    if (requests.status !== serviceStatuses.SUCCESS) {
        return res.status(400).json({
            message: requests.message
        });
    }

    res.status(200).json({
        data: requests.data
    });
}

const getByID = async (req: Request, res: Response) => {
    const ID = req.params.id;
    const request: employeeRequestReturn = await employeeRequestServices.getByID(ID);
    if (request.status === serviceStatuses.FAILED) {
        return res.status(404).json({
            message: request.message
        });
    } else if (request.status === serviceStatuses.ERROR) {
        return res.status(400).json({
            message: request.message
        });
    }

    res.status(200).json({
        data: request.data
    });
}

const del = async (req: Request, res: Response) => {
    const ID = req.params.id;
    const request: employeeRequestReturn = await employeeRequestServices.del(ID);
    if (request.status === serviceStatuses.FAILED) {
        return res.status(404).json({
            message: request.message
        });
    } else if (request.status === serviceStatuses.ERROR) {
        return res.status(400).json({
            message: request.message
        });
    }

    res.status(200).json({
        message: request.message
    });
}

empRequestRouter.post('/employee-request', validationFunctions.createEmployeeRequestBodyValidationRules(),
    validationFunctions.validationMiddleware, create);
empRequestRouter.get('/employee-request', checkIfAdmin, getAll);
empRequestRouter.get('/employee-request/:id', checkIfAdmin, getByID);
empRequestRouter.delete('/employee-request/:id', checkIfAdmin, del);

export default empRequestRouter;