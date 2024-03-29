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
exports.TimeSheetEntryAgent = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const timesheetEntrySchema = new mongoose_1.Schema({
    taskID: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Task',
        required: true
    },
    employeeID: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    clientID: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Client',
        required: true
    },
    timeTracked: Number,
    trackedDay: Date,
    startTime: Date,
    endTime: Date,
    cost: Number,
    description: String,
    timesheetRow: Number,
});
const TimeSheetEntryAgent = mongoose_1.default.model('TimesheetEntry', timesheetEntrySchema);
exports.TimeSheetEntryAgent = TimeSheetEntryAgent;
