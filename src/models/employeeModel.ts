import mongoose, { Schema } from "mongoose";

type EmployeeDocument = {
    firstName: string,
    lastName: string,
    joinDate: Date,
    email: string,
    employmentType: string,
    title: string,
    phoneNumber?: string,
    linkedinAccount?: string,
    team?: string,
    probationDate?: Date,
    password?: string,
    gender?: string,
    DOB?: Date,
    nationality?: string,
    twitterAccount?: string,
    facebookAccount?: string,
    pronouns?: string,
    location?: string,
    manager?: string,
    noticePeriod?: number,
    paymentCurrency?: string,
    maritalStatus?: string,
    personalEmail?: string,
    personalMobile?: string,
    address?: string,
    image?: string,
    status?: string,
    role?: string
}

type EmployeeInput = {
    firstName: EmployeeDocument['firstName'],
    lastName: EmployeeDocument['lastName'],
    joinDate: EmployeeDocument['joinDate'],
    email: EmployeeDocument['email'],
    employmentType: EmployeeDocument['employmentType'],
    title: EmployeeDocument['title'],
    phoneNumber?: EmployeeDocument['phoneNumber'],
    linkedinAccount?: EmployeeDocument['linkedinAccount'],
    team?: EmployeeDocument['team'],
    gender?: EmployeeDocument['gender'],
    DOB?: EmployeeDocument['DOB'],
    nationality?: EmployeeDocument['nationality']
    twitterAccount?: EmployeeDocument['twitterAccount'],
    facebookAccount?: EmployeeDocument['facebookAccount'],
    pronouns?: EmployeeDocument['pronouns'],
    location?: EmployeeDocument['location'],
    manager?: EmployeeDocument['manager'],
    noticePeriod?: EmployeeDocument['noticePeriod'],
    paymentCurrency?: EmployeeDocument['paymentCurrency'],
    maritalStatus?: EmployeeDocument['maritalStatus'],
    personalEmail?: EmployeeDocument['personalEmail'],
    personalMobile?: EmployeeDocument['personalMobile'],
    address?: EmployeeDocument['address'],
    image?: EmployeeDocument['image'],
    status?: EmployeeDocument['status']
}

const employeeSchema: Schema = new Schema({
    firstName: String,
    lastName: String,
    joinDate: Date,
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
    twitterAccount: String,
    facebookAccount: String,
    pronouns: String,
    location: String,
    manager: String,
    noticePeriod: Number,
    paymentCurrency: String,
    maritalStatus: String,
    personalEmail: String,
    personalMobile: String,
    address: String,
    image: String,
    status: String,
    role: {
        type: String,
        default: null
    }
});

const EmployeeAgent = mongoose.model<EmployeeDocument>('Employee', employeeSchema);

export { EmployeeDocument, EmployeeInput, EmployeeAgent }