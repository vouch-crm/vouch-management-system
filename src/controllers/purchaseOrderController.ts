import { purchaseOrderServices } from "../services/purchaseOrderServices";
import { serviceStatuses } from "../services/enums";
import express, { Request, Response } from 'express';
import { purchaseOrderDTO } from "../models/purchaseOrderModel";
import { validationFunctions } from "../middlewares/validation";
import { checkIfEmployeeHasFinancesAcces } from "../middlewares/employeeMiddleware";

const purchaseOrderRouter = express.Router();

export default purchaseOrderRouter;