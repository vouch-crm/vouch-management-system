import mongoose, { Schema } from "mongoose";

type TimeSheetEntryDTO = {
    taskID: string,
    employeeID: string,
    clientID: string,
    timeTracked: Number, // in seconds
    trackedDay: Date,
    startTime?: Date,
    endTime?: Date,
    cost?: number,
    description?: string,
    timesheetRow: number,
    billable: boolean
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
    clientID: {
        type: Schema.Types.ObjectId,
        ref: 'Client',
        required: true
    },
    timeTracked: {
        type: Number,
        required: true
    }, // in seconds
    trackedDay: Date,
    startTime: Date,
    endTime: Date,
    cost: Number,
    description: String,
    timesheetRow: Number,
    billable: Boolean
})

const TimeSheetEntryAgent = mongoose.model<TimeSheetEntryDTO>(
    'TimesheetEntry', timesheetEntrySchema);

export { TimeSheetEntryDTO, TimeSheetEntryAgent }