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
exports.jobAgent = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const jobSchema = new mongoose_1.Schema({
    client: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'client',
        required: true
    },
    clientSector: String,
    vouchAccountLead: String,
    additionalTeamOnAccount: [String],
    coreServices: [String],
    clientAccess: {
        metaAds: Boolean,
        googleAds: Boolean,
        tiktokAds: Boolean,
        googleTagManager: Boolean,
        googleAnalytics4: Boolean,
        tracking: Boolean
    },
    additionalInfo: String,
    workflowUpdates: {
        type: Boolean,
        default: false
    },
    marketingUpdates: {
        type: Boolean,
        default: false
    },
    contract: String,
    SLA: String,
    budgetSetup: [
        {
            month: String,
            managementFee: Number,
            percentageMediaSpend: Number,
            projectCost: Number,
            ROASTarget: Number
        }
    ],
    totalClientMediaSpend: String,
    campaignGoalSetup: {
        awareness: Boolean,
        sales: Boolean,
        booking: Boolean,
        leads: Boolean
    },
    jobSetupTimesheet: {
        fbInstagramAdManagement: {
            type: Boolean,
            default: false
        },
        externalMeeting: {
            type: Boolean,
            default: false
        },
        internalMeeting: {
            type: Boolean,
            default: false
        },
        contentCreation: {
            type: Boolean,
            default: false
        },
        strategyAndPlanning: {
            type: Boolean,
            default: false
        },
        SEO: {
            type: Boolean,
            default: false
        },
        Reporting: {
            type: Boolean,
            default: false
        },
        contentShoots: {
            type: Boolean,
            default: false
        },
        webDevelopment: {
            type: Boolean,
            default: false
        },
        contractorTime: {
            type: Boolean,
            default: false
        },
        socialListening: {
            type: Boolean,
            default: false
        },
        PPC: {
            type: Boolean,
            default: false
        }
    },
});
exports.jobAgent = mongoose_1.default.model('job', jobSchema);
