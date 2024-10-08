import { purchaseOrderServices } from "../services/purchaseOrderServices";
import { serviceStatuses } from "../services/enums";
import express, { Request, Response } from 'express';
import { purchaseOrderDTO } from "../models/purchaseOrderModel";
import { validationFunctions } from "../middlewares/validation";
import { checkIfEmployeeHasFinancesAccess } from "../middlewares/employeeMiddleware";
import { sendNotification } from "../services/notificationsServices";
import mongoose from "mongoose";

const purchaseOrderRouter = express.Router();

const create = async(req: Request, res: Response) => {
    const requestBody: purchaseOrderDTO = req.body;
    console.log(requestBody)
    const purchaseOrder = await purchaseOrderServices.create(requestBody);

    if (purchaseOrder.status !== serviceStatuses.SUCCESS) {
        return res.status(400).json({
            message: purchaseOrder.message
        });
    }

    // @ts-ignore
    sendNotification({empID: requestBody.manager, message: `There is a new purchase order request!`})

    res.status(201).json({
        message: requestBody
    });
}

const getAll = async(req: Request, res: Response) => {
    const orders = await purchaseOrderServices.getAll();
    if (orders.status !== serviceStatuses.SUCCESS) {
        return res.status(400).json({
            message: orders.message
        });
    }

    res.status(200).json({
        data: orders.data
    });
}

const getEmployeeOrders = async(req: Request, res: Response) => {
    const ID = req.params.id;
    const orders = await purchaseOrderServices.getEmployeeOrders(ID);

    if (orders.status === serviceStatuses.FAILED) {
        return res.status(404).json({
            message: orders.message
        });
    } else if (orders.status === serviceStatuses.ERROR) {
        return res.status(400).json({
            message: orders.message
        });
    }

    res.status(200).json({
        data: orders.data
    });
}

const update = async(req: Request, res: Response) => {
    const ID = req.params.id;
    const orderStatus = req.body.status;
    if (orderStatus !== 'accepted' && orderStatus !== 'declined' && orderStatus === undefined) {
        return res.status(400).json({
            message: 'Invalid request body!'
        });
    }

    const updatedOrder = await purchaseOrderServices.update(ID, orderStatus);

    if (updatedOrder.status === serviceStatuses.FAILED) {
        return res.status(404).json({
            message: updatedOrder.message
        });
    } else if (updatedOrder.status === serviceStatuses.ERROR) {
        return res.status(400).json({
            message: updatedOrder.message
        });
    }

    res.status(200).json({
        message: updatedOrder.message
    });
}

const updateOrderInfo = async(req: Request, res: Response) => {
    const ID = req.params.id;
    const {jobPhase, supplierType} = req.body;

    if(jobPhase === undefined && supplierType === undefined) {
        return res.status(400).json({
            message: 'Invalid request body!'
        });
    }

    const orderData = {
        jobPhase,
        supplierType
    }
    const updatedOrder = await purchaseOrderServices.updateOrderInfo(ID, orderData);

    if (updatedOrder.status === serviceStatuses.FAILED) {
        return res.status(404).json({
            message: updatedOrder.message
        });
    } else if (updatedOrder.status === serviceStatuses.ERROR) {
        return res.status(400).json({
            message: updatedOrder.message
        });
    }

    res.status(200).json({
        message: updatedOrder.message
    });
}

const del = async(req: Request, res: Response) => {
    const ID = req.params.id;
    const deletedOrder = await purchaseOrderServices.del(ID);

    if (deletedOrder.status === serviceStatuses.FAILED) {
        return res.status(404).json({
            message: deletedOrder.message
        });
    } else if (deletedOrder.status === serviceStatuses.ERROR) {
        return res.status(400).json({
            message: deletedOrder.message
        });
    }

    res.status(200).json({
        data: deletedOrder.data
    }); 
}

purchaseOrderRouter.post('/purchase-order', validationFunctions.createPurchaseOrderValidationRules(),
    validationFunctions.validationMiddleware, create);
purchaseOrderRouter.put('/purchase-order/:id', checkIfEmployeeHasFinancesAccess, update);
purchaseOrderRouter.put('/purchase-order-info-update/:id', updateOrderInfo);
purchaseOrderRouter.get('/purchase-order', checkIfEmployeeHasFinancesAccess, getAll);
purchaseOrderRouter.get('/purchase-order/:id', getEmployeeOrders);
purchaseOrderRouter.delete('/purchase-order/:id', del);

export default purchaseOrderRouter;