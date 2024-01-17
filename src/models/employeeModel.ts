import mongoose, { Schema } from "mongoose";

export interface IEmployee {
    id?: string,
    name?: string,
    joinDate: Date,
    email: string,
    employmentType?: string,
    title?: string,
    phoneNumber?: string,
    linkedinAccount?: string,
    team?: string,
    probationDate?: Date,
    password?: string,
    gender?: string,
    DOB?: Date,
    nationality?: string
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

export const employeeAgent = mongoose.model<IEmployee>('employee', employeeSchema);