import mongoose, {Schema} from "mongoose";

export interface IJob {
    clientSector: string,
    vouchAccountLead: [string],
    additionalTeamOnAccount: [String],
    coreServices: [String],
    client?: mongoose.Schema.Types.ObjectId
    clientAccess?: {
        metaAds: Boolean,
        googleAds: Boolean,
        tiktokAds: Boolean,
        googleTagManager: Boolean,
        googleAnalytics4: Boolean,
    },
    additionalInfo?: String,
    workflowUpdates?: boolean,
    marketingUpdates?: boolean
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
    }
});

export const jobAgent = mongoose.model<IJob>('job', jobSchema);