import express, { Request, Response } from 'express';
import { serviceStatuses, payFrequency, basis } from '../services/enums';
import { SalaryUpdatesDocument } from '../models/salaryUpdatesModel';
import { salaryUpdatesReturn, salaryUpdatesServices } from '../services/salaryUpdatesServices';
import { validationFunctions } from '../middlewares/validation';
import { checkIfAdmin } from '../middlewares/adminMiddleware';

const salaryUpdatesRouter = express.Router();

const create = async (req: Request, res: Response) => {
    const salaryData: SalaryUpdatesDocument = req.body;
    switch (salaryData.payFrequency) {
        case payFrequency.WEEKLY:
            break;
        case payFrequency.MONTHLY:
            break;
        case payFrequency.FOUR_WEEKLY:
            break;
        case payFrequency.BI_WEEKLY:
            break;
        case payFrequency.BI_MONTHLY:
            break;
    
        default:
            return res.status(404).json({
                message: 'Invalid pay frequency!'
            });
    }
    switch (salaryData.basis) {
        case basis.PER_WEEK:
            break;
        case basis.PER_HOUR:
            break;
        case basis.PER_DAY:
            break;
        case basis.PER_MONTH:
            break;
        case basis.PER_ANNUM:
            break;
    
        default:
            return res.status(404).json({
                message: 'Invalid basis!'
            });
    }

    const dbResponse: salaryUpdatesReturn = await salaryUpdatesServices.create(salaryData);
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
    const salaries: salaryUpdatesReturn = await salaryUpdatesServices.getAll();
    if (salaries.status !== serviceStatuses.SUCCESS) {
        return res.status(400).json({
            message: salaries.message
        });
    }

    res.status(200).json({
        data: salaries.data
    });
}

const update = async (req: Request, res: Response) => {
    const ID = req.params.id;
    const updatedData: Record<string, any> = req.body;
    const dbResponse: salaryUpdatesReturn = await salaryUpdatesServices.update(ID, updatedData);
    if (dbResponse.status === serviceStatuses.FAILED) {
        return res.status(404).json({
            message: dbResponse.message
        });
    } else if (dbResponse.status === serviceStatuses.ERROR) {
        return res.status(400).json({
            message: dbResponse.message
        });
    }

    res.status(200).json({
        message: dbResponse.message,
        data: dbResponse.data
    });
}

const del = async (req: Request, res: Response) => {
    const ID = req.params.id;
    const dbResponse: salaryUpdatesReturn = await salaryUpdatesServices.del(ID);
    if (dbResponse.status === serviceStatuses.FAILED) {
        return res.status(404).json({
            message: dbResponse.message
        });
    } else if (dbResponse.status === serviceStatuses.ERROR) {
        return res.status(400).json({
            message: dbResponse.message
        });
    }

    res.status(200).json({
        message: dbResponse.message,
    });
}

salaryUpdatesRouter.post('/employee-salary', checkIfAdmin, validationFunctions
    .createSalaryUpdateBodyValidationRules(), validationFunctions.validationMiddleware, create);
salaryUpdatesRouter.get('/employee-salary', checkIfAdmin, getAll);
salaryUpdatesRouter.put('/employee-salary/:id', checkIfAdmin, update);
salaryUpdatesRouter.delete('/employee-salary/:id', checkIfAdmin, del);

export default salaryUpdatesRouter;