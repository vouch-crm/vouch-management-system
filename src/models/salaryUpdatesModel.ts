import mongoose, { Schema } from 'mongoose';

type SalaryUpdatesDocument = {
    currency?: string,
    empID: string,
    amount: number,
    reasonForChange?: string,
    FTE?: string,
    basis: string,
    payFrequency: string,
    employeeBasis?: 'Full Time' | 'Part Time',
    startDate: Date,
    endDate?: Date,
    notes?: string
}

const salaryUpdatesSchema = new Schema({
    currency: String,
    empID: {
        type: Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    amount: Number,
    reasonForChange: String,
    FTE: String,
    basis: String,
    payFrequency: String,
    employeeBasis: String,
    startDate: Date,
    endDate: Date,
    notes: String
});

const SalaryUpdatesAgent = mongoose.model<SalaryUpdatesDocument>('SalaryUpdates',
    salaryUpdatesSchema);


export { SalaryUpdatesDocument, SalaryUpdatesAgent }