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
})

// timesheetEntrySchema.pre('save', async function(next) {
//     try {
//         await this.populate('employeeID')
//         this.cost = (this.employeeID as any).hourlyRate * (this.timeTracked / 3600) 
//         next()
//     } catch (error: any) {
//         next(error)
//     }
// })

const TimeSheetEntryAgent = mongoose.model<TimeSheetEntryDTO>(
    'TimesheetEntry', timesheetEntrySchema);

export {TimeSheetEntryDTO, TimeSheetEntryAgent}