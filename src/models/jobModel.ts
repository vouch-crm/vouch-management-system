import mongoose, {Schema} from "mongoose";

export interface IJob {
    id?: string,
    clientSector: string,
    vouchAccountLead: [string],
    additionalTeamOnAccount: [string],
    coreServices?: [string],
    client?: string
    clientAccess?: {
        metaAds: Boolean,
        googleAds: Boolean,
        tiktokAds: Boolean,
        googleTagManager: Boolean,
        googleAnalytics4: Boolean,
    },
    additionalInfo?: string,
    workflowUpdates?: boolean,
    marketingUpdates?: boolean,
    bookingForm?: string,
    SLA?: string,
    budgetSetup?: {
        managementFee: Number,
        percentageMediaSpend: Number,
        projectCost: Number,
        ROASTarget: Number
    },
    totalClientMediaSpend?: string,
    campaignGoalSetup?: [string],
    jobSetupTimesheet?: {
        fbInstagramAdManagement: boolean,
        externalMeeting: boolean,
        internalMeeting: boolean,
        contentCreation: boolean,
        strategyAndPlanning: boolean,
        SEO: boolean,
        Reporting: boolean,
        contentShoots: boolean,
        webDevelopment: boolean,
        contractorTime: boolean,
        socialListening: boolean,
        PPC: boolean
    }
}

const jobSchema: Schema = new Schema({
    client: {
        type: mongoose.Schema.Types.ObjectId,
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
        googleAnalytics4: Boolean
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
    bookingForm: String,
    SLA: String,
    budgetSetup: {
        managementFee: Number,
        percentageMediaSpend: Number,
        projectCost: Number,
        ROASTarget: Number
    },
    totalClientMediaSpend: String,
    campaignGoalSetup: [String],
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
    }
});

export const jobAgent = mongoose.model<IJob>('job', jobSchema);