import mongoose, { Schema } from "mongoose";


interface TaskSchema {
    clientID: Schema.Types.ObjectId;
    clientName: string;
    name: string;
    jobID?: Schema.Types.ObjectId;
    access?: string[];
    estimatedTotalHours: number;
    estimatedTotalCost: number;
    progress: number;
    billable: boolean;
    estimatedTime?: number; // in hours
    category: string;
}

const taskSchema: Schema = new Schema({
    clientID: Schema.Types.ObjectId,
    clientName: String,
    jobID: Schema.Types.ObjectId,
    access: [String],
    name: String,
    estimatedTotalHours: Number,
    estimatedTotalCost: Number,
    progress: Number,
    billable: Boolean,
    estimatedTime: Number, // in hours
    category: String,

})

export const TaskAgent = mongoose.model<TaskSchema>('Task', taskSchema)