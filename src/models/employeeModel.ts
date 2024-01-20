import mongoose, { Schema } from "mongoose";

type EmployeeDocument = {
    firstName: string,
    lastName: string,
    joinDate: Date,
    email: string,
    employmentType: string,
    title: string,
    phoneNumber: string,
    linkedinAccount: string,
    team: string,
    probationDate: Date,
    password: string,
    gender: string,
    DOB: Date,
    nationality: string
}

type EmployeeInput = {
    firstName: EmployeeDocument['firstName'],
    lastName: EmployeeDocument['lastName'],
    joinDate: EmployeeDocument['joinDate'],
    email: EmployeeDocument['email'],
    employmentType: EmployeeDocument['employmentType'],
    title: EmployeeDocument['title'],
    phoneNumber: EmployeeDocument['phoneNumber'],
    linkedinAccount: EmployeeDocument['linkedinAccount'],
    team: EmployeeDocument['team'],
    gender: EmployeeDocument['gender'],
    DOB: EmployeeDocument['DOB'],
    nationality: EmployeeDocument['nationality']
}

const employeeSchema: Schema = new Schema({
    name: {
        type: String
    },
    joinDate: {
        type: Date
    },
    email: {
        type: String,
        unique: true
    },
    employmentType: String,
    title: String,
    phoneNumber: String,
    linkedinAccount: String,
    team: String,
    probationDate: Date,
    password: {
        type: String,
        required: true,
    },
    gender: String,
    DOB: Date,
    nationality: String,
});

const EmployeeAgent = mongoose.model<EmployeeDocument>('Employee', employeeSchema);

export { EmployeeDocument, EmployeeInput, EmployeeAgent }