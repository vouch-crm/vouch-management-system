"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeAgent = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const employeeSchema = new mongoose_1.Schema({
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
const EmployeeAgent = mongoose_1.default.model('Employee', employeeSchema);
exports.EmployeeAgent = EmployeeAgent;
