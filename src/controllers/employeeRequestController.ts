import express, { Request, Response } from 'express';
import { employeeRequests, serviceStatuses } from '../services/enums';
import { EmployeeRequestDocument } from '../models/employeeRequests';
import { employeeRequestReturn, employeeRequestServices } from '../services/employeeRequestServices';
import { validationFunctions } from '../middlewares/validation';

const empRequestRouter = express.Router();

const create = async (req: Request, res: Response) => {
    const requestData = req.body;
    const status = 'pending';
    let requestType: string;
    switch (requestData.type) {
        case employeeRequests.EARLYLEAVE:
            requestType = employeeRequests.EARLYLEAVE;
            break;
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
        status: status,
        requestedDay: requestData.requestedDay,
        empID: requestData.empID,       
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

empRequestRouter.post('employee-request', validationFunctions.createEmployeeRequestBodyValidationRules(),
    validationFunctions.validationMiddleware, create);

export default empRequestRouter;