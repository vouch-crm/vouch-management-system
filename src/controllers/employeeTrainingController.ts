import express, {Request, Response} from "express";
import { EmployeeTrainingDocument } from "../models/employeeTraining";
import { employeeTrainingReturn, employeeTrainingServices} from "../services/employeeTrainingServices";
import { serviceStatuses } from "../services/enums";
import { checkIfAdmin } from "../middlewares/adminMiddleware";
import { validationFunctions } from "../middlewares/validation";


const employeeTrainingRouter = express.Router();

const create = async (req: Request, res: Response) => {
    const trainingData: EmployeeTrainingDocument = req.body;
    const dbResponse: employeeTrainingReturn = await employeeTrainingServices.create(trainingData);
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
    const trainings: employeeTrainingReturn = await employeeTrainingServices.getAll();
    if (trainings.status !== serviceStatuses.SUCCESS) {
        return res.status(400).json({
            message: trainings.message
        });
    }

    res.status(200).json({
        data: trainings.data
    });
}

const getByID = async (req: Request, res: Response) => {
    const ID = req.params.id;
    const dbResponse: employeeTrainingReturn = await employeeTrainingServices
        .getByID(ID);
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
        data: dbResponse.data
    });
}

const getEmployeeTraining = async (req: Request, res: Response) => {
    const empID = req.params.id;
    const dbResponse = await employeeTrainingServices.getEmployeeTraining(empID);
    if (dbResponse.status !== serviceStatuses.SUCCESS) {
        return res.status(400).json({
            message: dbResponse.message
        });
    }

    res.status(200).json({
        data: dbResponse.data
    });
}

const update = async (req: Request, res: Response) => {
    const ID = req.params.id;
    const updatedTraining: Record<string, any> = req.body;
    const dbResponse: employeeTrainingReturn = await employeeTrainingServices.update(ID, updatedTraining);
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
    const dbResponse: employeeTrainingReturn = await employeeTrainingServices.del(ID);
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

employeeTrainingRouter.post('/employee-training', checkIfAdmin, validationFunctions
    .createTrainingBodyValidationRules(), validationFunctions.validationMiddleware, create);
employeeTrainingRouter.get('/employee-training', checkIfAdmin, getAll);
employeeTrainingRouter.get('/employee-training/:id', checkIfAdmin, getByID);
employeeTrainingRouter.get('/employee-all-trainings/:id', checkIfAdmin, getEmployeeTraining);
employeeTrainingRouter.put('/employee-training/:id', checkIfAdmin, update);
employeeTrainingRouter.delete('/employee-training/:id', checkIfAdmin, del);

export default employeeTrainingRouter;