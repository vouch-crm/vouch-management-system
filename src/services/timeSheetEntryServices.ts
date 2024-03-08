import { TimeSheetEntryDTO, TimeSheetEntryAgent } from "../models/timesheetEntryModel";
import { serviceStatuses } from "./enums";

export type TimeSheetEntryReturn = {
    status: string,
    message: string | null,
    data: Record<string, any> | null
}

const create = async (timeSheetEntry: TimeSheetEntryDTO): Promise<TimeSheetEntryReturn> => {
    try {
        const newEntry = await TimeSheetEntryAgent.create(timeSheetEntry);

        return {
            status: serviceStatuses.SUCCESS,
            message: "New entry has been recorded!",
            data: newEntry
        }
    } catch (error) {
        return {
            status: serviceStatuses.ERROR,
            message: `Error recording the new entry: ${error}`,
            data: null
        }
    }
}

const getAll = async (): Promise<TimeSheetEntryReturn> => {
    try {
        const entries: TimeSheetEntryDTO[] = await TimeSheetEntryAgent.find();

        return {
            status: serviceStatuses.SUCCESS,
            message: null,
            data: entries
        }
    } catch (error) {
        return {
            status: serviceStatuses.ERROR,
            message: `Error fetching time sheet entries: ${error}`,
            data: null
        }
    }
}

const getByID = async (ID: string): Promise<TimeSheetEntryReturn> => {
    try {
        const entry = await TimeSheetEntryAgent.findById(ID);
        if (!entry) {
            return {
                status: serviceStatuses.FAILED,
                message: `No entry with ID: ${ID}`,
                data: null
            }
        }

        return {
            status: serviceStatuses.SUCCESS,
            message: null,
            data: entry
        }
    } catch (error) {
        return {
            status: serviceStatuses.ERROR,
            message: `Error fetching entry with ID: ${ID}`,
            data: null
        }
    }
}

const getEntriesWithinPeriod = async (
    empID: string, startDate: Date, endDate: Date): Promise<TimeSheetEntryReturn> => {
        try {
            const entries = await TimeSheetEntryAgent.find({
                trackedDay: {$gte: startDate, $lte: endDate},
                employeeID: empID
            });
            return {
                status: serviceStatuses.SUCCESS,
                message: null,
                data: entries
            }
        } catch (error) {
            return {
                status: serviceStatuses.ERROR,
                message: `Error getting entries: ${error}`,
                data: null
            }
        }
    }

const update = async (ID: string, updatedData: Record<string, any>): Promise<TimeSheetEntryReturn> => {
    try {
        const updatedEntry = await TimeSheetEntryAgent.findByIdAndUpdate(ID, updatedData, {new: true});
        if (!updatedEntry) {
            return {
                status: serviceStatuses.FAILED,
                message: `No entry with ID: ${ID}`,
                data: null
            }
        }

        return {
            status: serviceStatuses.SUCCESS,
            message: 'Entry updated successfuly!',
            data: updatedEntry
        }
    } catch (error) {
        return {
            status: serviceStatuses.ERROR,
            message: `Error updating entry with ID: ${ID}`,
            data: null
        }
    }
}

const del = async (IDs: string[]): Promise<TimeSheetEntryReturn> => {
    try {
        const deletedEntry = await TimeSheetEntryAgent.deleteMany({
            _id: {$in: IDs}
        });
        if (!deletedEntry) {
            return {
                status: serviceStatuses.FAILED,
                message: `No entries with IDs: ${IDs}`,
                data: null
            }
        }

        return {
            status: serviceStatuses.SUCCESS,
            message: 'Entry deleted successfuly!',
            data: null
        }
    } catch (error) {
        return {
            status: serviceStatuses.ERROR,
            message: `Error deleting entries with IDs: ${IDs}`,
            data: null
        }
    }
}

export const timeSheetEntryServices = {
    create,
    getAll,
    getByID,
    getEntriesWithinPeriod,
    update,
    del
}