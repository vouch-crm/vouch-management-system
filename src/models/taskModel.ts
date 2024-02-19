import mongoose, { Schema } from "mongoose";


interface TaskSchema {
    client: Schema.Types.ObjectId;
    project: Schema.Types.ObjectId;
    access: string[];
    estimatedTotalHours: number;
    estimatedTotalCost: number
    progress: number;
    billable: boolean;
    estimatedTime: number; // in hours
}

const taskSchema: Schema = new Schema({
    client: Schema.Types.ObjectId,
    project: Schema.Types.ObjectId,
    access: [String],
    estimatedTotalHours: Number,
    estimatedTotalCost: Number,
    progress: Number,
    billable: Boolean,
    estimatedTime: Number, // in hours

})

export const TaskAgent = mongoose.model<TaskSchema>('Task', taskSchema)