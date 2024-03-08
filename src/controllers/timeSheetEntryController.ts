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

const getAll = async (req: Request, res: Response) => {
    const allEntries = await timeSheetEntryServices.getAll();
    if (allEntries.status !== serviceStatuses.SUCCESS) {
        return res.status(400).json({
            message: allEntries.message
        });
    }

    res.status(200).json({
        data: allEntries.data
    });
}

const getEntriesWithinPeriod = async (req: Request, res: Response) => {
    const employeeID = req.params.employeeID;
    const startDate = req.params.startDate as unknown as Date;
    const endDate = req.params.endDate as unknown as Date;
    const entries = await timeSheetEntryServices.getEntriesWithinPeriod(
        employeeID, startDate, endDate);
    if (entries.status !== serviceStatuses.SUCCESS) {
        return res.status(400).json({
            message: entries.message
        });
    }

    res.status(200).json({
        data: entries.data
    });
}

const update = async (req: Request, res: Response) => {
    const entryID = req.params.id;
    const requestData = req.body;
    if (requestData.timeTracked) {
        const hourlyRate: number | undefined = await employeeServices.getEmpHourlyRate(
            requestData.employeeID);
        if (hourlyRate === undefined) {
            return res.status(404).json({
                message: `No employee found with this ID: ${requestData.employeeID}`
            });
        }
        requestData['cost'] = (((requestData.timeTracked as number) / 3600) * hourlyRate);
    }

    const updatedEntry = await timeSheetEntryServices.update(entryID, requestData);
    if (updatedEntry.status === serviceStatuses.FAILED) {
        return res.status(404).json({
            message: updatedEntry.message
        });
    } else if (updatedEntry.status === serviceStatuses.ERROR) {
        return res.status(400).json({
            message: updatedEntry.message
        });
    }

    res.status(200).json({
        message: updatedEntry.message,
        data: updatedEntry.data
    });
}

const del = async (req: Request, res: Response) => {
    const entryIDs = req.body.IDs;
    const deletedEntry = await timeSheetEntryServices.del(entryIDs);
    if (deletedEntry.status === serviceStatuses.FAILED) {
        return res.status(404).json({
            message: deletedEntry.message
        });
    } else if (deletedEntry.status === serviceStatuses.ERROR) {
        return res.status(400).json({
            message: deletedEntry.message
        });
    }

    res.status(200).json({
        message: deletedEntry.message,
    });
}

timeSheetController.post('/time-sheet-entry', create);
timeSheetController.get('/time-sheet-entry', getAll);
timeSheetController.get('/time-sheet-entry/:employeeID/:startDate/:endDate', getEntriesWithinPeriod);
timeSheetController.patch('/time-sheet-entry/:id', update);
timeSheetController.post('/time-sheet-entries', del);

export default timeSheetController;