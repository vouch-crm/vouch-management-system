import mongoose, { Schema } from "mongoose";


interface TaskSchema {
    client: Schema.Types.ObjectId;
    projectID: string,
    name: string;
    jobID?: Schema.Types.ObjectId;
    access?: string[];
    estimatedTotalHours: number;
    estimatedTotalCost: number;
    progress?: number;
    billable: boolean;
    estimatedTime?: number; // in hours
    category: string;
    color: string;
}

const taskSchema: Schema = new Schema({
    client: {
        type: Schema.Types.ObjectId,
        ref: 'client'
    },
    projectID: {
        type: Schema.Types.ObjectId,
        ref: 'project'
    },
    jobID: Schema.Types.ObjectId,
    access: [String],
    name: String,
    estimatedTotalHours: Number,
    estimatedTotalCost: Number,
    progress: Number,
    billable: Boolean,
    estimatedTime: Number, // in hours
    category: String,
    color: String

})

export const TaskAgent = mongoose.model<TaskSchema>('Task', taskSchema)