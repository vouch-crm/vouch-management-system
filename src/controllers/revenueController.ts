import { revenueServices, revenueReturn } from "../services/revenueServices";
import { serviceStatuses } from "../services/enums";
import express, {Request, Response} from 'express';
import { revenueDTO } from "../models/revenueModel";
import { validationFunctions } from "../middlewares/validation";

const revenueRouter = express.Router();

const create = async(req: Request, res: Response) => {
    const requestData: revenueDTO = req.body;
    const newRevenue = await revenueServices.create(requestData);

    if(newRevenue.status !== serviceStatuses.SUCCESS) {
        return res.status(400).json({
            message: newRevenue.message
        });
    }

    res.status(201).json({
        message: newRevenue.message,
        data: newRevenue.data
    });
}

const del = async(req: Request, res: Response) => {
    const ID = req.params.id;
    const deletedRevenue = await revenueServices.del(ID);

    if(deletedRevenue.status === serviceStatuses.FAILED) {
        return res.status(404).json({
            message: deletedRevenue.message
        });
    } else if(deletedRevenue.status === serviceStatuses.ERROR) {
        return res.status(400).json({
            message: deletedRevenue.message
        });
    }

    res.status(200).json({
        message: deletedRevenue.message
    });
}

revenueRouter.post('/revenue', validationFunctions.createRevenueBodyValidationRules(),
   validationFunctions.validationMiddleware, create);
revenueRouter.delete('/revenue/:id', del);

export default revenueRouter;