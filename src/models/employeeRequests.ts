import mongoose, { Schema } from 'mongoose'

type EmployeeRequestDocument = {
    type: string,
    empID: string,
    requestedDay: Date,
    endDate?: Date,
    notes?: string,
    startDateFullDay?: boolean,
    endDateFullDay?: boolean,
    status?: 'Pending' | 'Approved' | 'Declined'
}

const employeeRequestSchema: Schema = new Schema({
    type: String,
    empID: {
        type: Schema.Types.ObjectId,
        ref: 'Employee', 
        required: true
    },
    requestedDay: Date,
    endDate: Date,
    notes: String,
    startDateFullDay: Boolean,
    endDateFullDay: Boolean,
    status: {
        type: String,
        default: 'Pending'
    }
});

const EmployeeRequestAgent = mongoose
    .model<EmployeeRequestDocument>('EmployeeRequest', employeeRequestSchema)

export { EmployeeRequestDocument, EmployeeRequestAgent }