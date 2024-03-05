import mongoose, { Schema } from "mongoose";

type TimeSheetEntryDTO = {
    taskID: string,
    employeeID: string,
    timeTracked: Number, // in seconds
    trackedDay: Date,
    startTime?: Date,
    endTime?: Date,
    cost?: number,
    description?: string,
    timesheetRow: number,
}

const timesheetEntrySchema = new Schema({
    taskID: {
        type: Schema.Types.ObjectId,
        ref: 'Task',
        required: true
    },
    employeeID: {
        type: Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    timeTracked: Number, // in seconds
    trackedDay: Date,
    startTime: Date,
    endTime: Date,
    cost: Number,
    description: String,
    timesheetRow: Number,
})

const TimeSheetEntryAgent = mongoose.model<TimeSheetEntryDTO>(
    'TimesheetEntrySchema', timesheetEntrySchema);

export {TimeSheetEntryDTO, TimeSheetEntryAgent};