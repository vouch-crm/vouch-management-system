import mongoose, { Schema } from 'mongoose'

type EmployeeRequestDocument = {
    type: string,
    status: string,
    empID: string,
    requestedDay: Date
}

const employeeRequestSchema: Schema = new Schema({
    type: String,
    status: String,
    empID: {
        type: Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    requestedDay: Date
});

const EmployeeRequestAgent = mongoose
    .model<EmployeeRequestDocument>('EmployeeRequest', employeeRequestSchema)

export { EmployeeRequestDocument, EmployeeRequestAgent }