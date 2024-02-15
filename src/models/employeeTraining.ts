import mongoose, { Schema } from 'mongoose';

type EmployeeTrainingDocument = {
    trainingTitle: string,
    empID: string,
    trainingType: string,
    TrainingCategory?: string,
    status?: string,
    startOn?: Date,
    endOn?: Date,
    reminderEmail?: string,
    provider?: string,
    currency?: string,
    cost?: number,
    outcome?: string,
    notes?: string
}

const employeeTrainingSchema = new Schema({
    empID: {
        type: Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    trainingTitle: String,
    trainingType: String,
    TrainingCategory: String,
    status: String,
    startOn: Date,
    endOn: Date,
    reminderEmail: String,
    provider: String,
    currency: String,
    cost: Number,
    outcome: String,
    notes: String
});

const EmployeeTrainingAgent = mongoose.model<EmployeeTrainingDocument>('EmployeeTraining',
    employeeTrainingSchema);


export { EmployeeTrainingDocument, EmployeeTrainingAgent }