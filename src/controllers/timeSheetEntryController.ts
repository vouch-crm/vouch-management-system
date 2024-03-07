import { timeSheetEntryServices, TimeSheetEntryReturn } from "../services/timeSheetEntryServices";
import { employeeServices } from "../services/employeeServices";
import { TimeSheetEntryDTO } from "../models/timesheetEntryModel";
import { serviceStatuses } from "../services/enums";
import express, { Request, Response } from "express";

const timeSheetController = express.Router();

const create = async (req: Request, res: Response) => {
    let requestData: TimeSheetEntryDTO = req.body;
    const empHourlyRate: number | undefined = await employeeServices.getEmpHourlyRate(
        requestData.employeeID);

    if (empHourlyRate === undefined) {
        return res.status(404).json({
            message: `No employee found with this ID: ${requestData.employeeID}`
        });
    }

    requestData.cost = ((requestData.timeTracked as number) / 3600) * empHourlyRate;
    const newEntry = await timeSheetEntryServices.create(requestData);
    if (newEntry.status !== serviceStatuses.SUCCESS) {
        return res.status(400).json({
            message: newEntry.message
        });
    }

    res.status(201).json({
        message: newEntry.message,
        data: newEntry.data
    });
}

timeSheetController.post('/time-sheet-entry', create);

export default timeSheetController;