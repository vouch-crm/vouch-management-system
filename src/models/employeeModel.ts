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
    password: string,
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
    martialStatus?: string,
    personalEmail?: string,
    personalMobile?: string,
    address?: string,
    image?: string,
    status?: string,
    role?: string
    hourlyRate?: number,
    maxCapacityHourlyRate?: number,
    financialData?: {
        bankName: string,
        branchName: string,
        sortCode: string,
        accountNumber: string,
        accountHolderName: string,
        buildingSociety: string,
        buildingSocietyRef: string
    },
    performanceDocument?: string,
    holidayAllowance?: number,
    holidayAdjustments?: { note: string, number: number }[],
    holdaysTaken?: number,
    sickDaysTaken?: number,
    workFromHome?: number,
    performanceLastUpdated?: Date,
    documents?: { title: string, url: string }[],
    potentialChargableTime?: number,
    maximumAnnualHours?: number,
    fullAccess?: {
        hrDashboard: boolean,
        timeTracker: boolean,
        finances: boolean
    },

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
    martialStatus?: EmployeeDocument['martialStatus'],
    personalEmail?: EmployeeDocument['personalEmail'],
    personalMobile?: EmployeeDocument['personalMobile'],
    address?: EmployeeDocument['address'],
    image?: EmployeeDocument['image'],
    status?: EmployeeDocument['status']
    hourlyRate?: EmployeeDocument['hourlyRate'],
    password: EmployeeDocument['password']

}

type EmployeeLogin = {
    email: string,
    password: string
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
    martialStatus: String,
    personalEmail: String,
    personalMobile: String,
    address: String,
    image: String,
    status: String,
    hourlyRate: {
        type: Number,
        default: 25,
    },
    maxCapacityHourlyRate: {
        type: Number,
        default: 75,
    },
    role: {
        type: String,
        default: null
    },
    financialData: {
        bankName: String,
        branchName: String,
        sortCode: String,
        accountNumber: String,
        accountHolderName: String,
        buildingSociety: String,
        buildingSocietyRef: String
    },
    performanceDocument: String,
    holidayAllowance: { type: Number, default: 25 },
    holidayAdjustments: [{ note: String, number: Number }],
    holdaysTaken: { type: Number, default: 0 },
    sickDaysTaken: { type: Number, default: 0 },
    workFromHome: { type: Number, default: 0 },
    performanceLastUpdated: Date,
    documents: Array,
    potentialChargableTime: { type: Number, default: 0.8 },
    maximumAnnualHours: { type: Number, default: 1665 },
    fullAccess: {
        hrDashboard: { type: Boolean, default: false },
        timeTracker: { type: Boolean, default: false },
        finances: { type: Boolean, default: false }
    }
});

const EmployeeAgent = mongoose.model<EmployeeDocument>('Employee', employeeSchema);

export { EmployeeDocument, EmployeeInput, EmployeeAgent, EmployeeLogin }