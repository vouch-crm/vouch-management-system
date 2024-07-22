import { revenueServices } from "../services/revenueServices";
import { serviceStatuses } from "../services/enums";
import express, { Request, Response } from 'express';
import { revenueDTO } from "../models/revenueModel";
import { validationFunctions } from "../middlewares/validation";
import { revenueMiddleware } from "../middlewares/revenueMiddlware";
import { projectServices } from "../services/projectServices"

const revenueRouter = express.Router();

const create = async (req: Request, res: Response) => {
    const requestData: revenueDTO = req.body;
    const newRevenue = await revenueServices.create(requestData);

    if (newRevenue.status !== serviceStatuses.SUCCESS) {
        return res.status(400).json({
            message: newRevenue.message
        });
    }

    res.status(201).json({
        message: newRevenue.message,
        data: newRevenue.data
    });
}

const getAll = async (req: Request, res: Response) => {
    const revenues = await revenueServices.getAll();

    if (revenues.status !== serviceStatuses.SUCCESS) {
        return res.status(400).json({
            message: revenues.message
        });
    }

    res.status(200).json({
        data: revenues.data
    });
}

const updateRevenueCellValue = async (req: Request, res: Response) => {
    const ID = req.params.id;
    const clientID = req.params.clientID
    const { monthName, updatedCell } = req.body;
    const dbResponse = await revenueServices.updateRevenueCellValue(ID, monthName, updatedCell);
    console.log(updatedCell.fees)
    console.log(req.body)
    console.log(req.params)
    const project = await projectServices.getProject(clientID, 'retainer')
        //@ts-ignore
    if(project.data.length === 0) {
        await projectServices.create({name: 'retainer', budget: updatedCell.retainer, clientID})
    }
    for(const fee in updatedCell.fees) {
        const project = await projectServices.getProject(clientID, fee)
        //@ts-ignore
        if(project.data.length === 0) {
            await projectServices.create({name: fee, budget: updatedCell.fees[fee], clientID})
        }
    }
    if (dbResponse.status === serviceStatuses.ERROR) {
        return res.status(400).json({
            message: dbResponse.message
        });
    } else if (dbResponse.status === serviceStatuses.FAILED) {
        return res.status(404).json({
            message: dbResponse.message
        });
    }

    res.status(200).json({
        message: dbResponse.message
    });
}

const updateConvertedCellValue = async (req: Request, res: Response) => {
    const ID = req.params.id;
    const { clientID, type, year, monthName, updatedValues } = req.body;
    const cellValues = {
        clientID: clientID,
        type: type,
        year: year,
        monthName: monthName,
        updatedValues: updatedValues
    }

    const dbResponse = await revenueServices.updateConvertedCellValues(cellValues);

    if (dbResponse.status === serviceStatuses.FAILED) {
        return res.status(400).json({
            message: dbResponse.message
        });
    } else if (dbResponse.status === serviceStatuses.ERROR) {
        return res.status(400).json({
            message: dbResponse.message
        });
    }

    const dbResponse2 = await revenueServices.removeCellData(ID, monthName);

    if (dbResponse.status === serviceStatuses.FAILED) {
        return res.status(404).json({
            message: dbResponse2.message
        });
    } else if (dbResponse2.status === serviceStatuses.ERROR) {
        return res.status(400).json({
            message: dbResponse2.message
        });
    }

    res.status(200).json({
        message: dbResponse2.message
    });
}

const del = async (req: Request, res: Response) => {
    const ID = req.params.id;
    const deletedRevenue = await revenueServices.del(ID);

    if (deletedRevenue.status === serviceStatuses.FAILED) {
        return res.status(404).json({
            message: deletedRevenue.message
        });
    } else if (deletedRevenue.status === serviceStatuses.ERROR) {
        return res.status(400).json({
            message: deletedRevenue.message
        });
    }

    res.status(200).json({
        message: deletedRevenue.message
    });
}

revenueRouter.post('/revenue', validationFunctions.createRevenueBodyValidationRules(),
    validationFunctions.validationMiddleware, 
    revenueMiddleware.checkClientIDAndYearExist, create);
revenueRouter.get('/revenue', getAll);
revenueRouter.put('/revenue-cell-update/:id/:clientID', validationFunctions.updateRevenueCellBodyValidations(),
    validationFunctions.validationMiddleware, updateRevenueCellValue);
revenueRouter.put('/revenue-converter-cell-update/:id',
    validationFunctions.updateConvertedRevenueCellBodyValidations(), 
    validationFunctions.validationMiddleware, updateConvertedCellValue);
revenueRouter.delete('/revenue/:id', del);

export default revenueRouter;