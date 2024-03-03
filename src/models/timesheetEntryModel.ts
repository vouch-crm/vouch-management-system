import mongoose, { Schema } from "mongoose";

interface TimesheetEntrySchema {
    taskID: Schema.Types.ObjectId;
    employeeID: Schema.Types.ObjectId;
    timeTracked: Number; // in seconds
    trackedDay: Date;
    startTime?: Date;
    endTime?: Date;
    cost?: number;
    description?: string;
    timesheetRow: number;
}

const timesheetEntrySchema = new Schema({
    taskID: Schema.Types.ObjectId,
    employeeID: Schema.Types.ObjectId,
    timeTracked: Number, // in seconds
    trackedDay: Date,
    startTime: Date,
    endTime: Date,
    cost: Number,
    description: String,
    timesheetRow: Number,
})

export const TimesheetEntryModel = mongoose.model<TimesheetEntrySchema>('TimesheetEntrySchema', timesheetEntrySchema)