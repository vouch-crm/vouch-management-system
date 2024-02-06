import mongoose, { Schema } from "mongoose";

interface TimesheetEntrySchema {
    taskID: Schema.Types.ObjectId;
    employeeID: Schema.Types.ObjectId;
    timeTracked: Number; // in seconds
    startTime: Date;
    endTime: Date;
    cost?: number;
    description?: string;
}

const timesheetEntrySchema = new Schema({
    taskID: Schema.Types.ObjectId,
    employeeID: Schema.Types.ObjectId,
    timeTracked: Number, // in seconds
    startTime: Date,
    endTime: Date,
    cost: Number,
    description: String,
})

export const TimesheetEntryModel = mongoose.model<TimesheetEntrySchema>('TimesheetEntrySchema', timesheetEntrySchema)