import mongoose, {Schema, Document} from "mongoose";

export interface IClient extends Document {
    clientBasicInfo: {
        name: string,
        email: string,
        companyName?: string,
        companyRegisterationNumber?: Number,
        vatRegisterationNumber?: Number,
        companyRegisteredAddress?: string,
        companyBillingAddress?: string,
        businessCommenced?: Date,
    },
    mainPointOfContact?: {
        name: string,
        position: string,
        email: string,
        telephoneNumber: string,
        officeAddress: string,
    },
    accountContactDetails?: {
        name: string,
        position: string,
        email: string,
        telephoneNumber: string,
        officeAddress: string,
    },
    additionalInfo?: string,
    workflowUpdates?: boolean,
    marketingUpdates?: boolean,
    emailSent?: boolean
}

const clientSchema: Schema = new Schema({
    clientBasicInfo: {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        companyName: String,
        companyRegisterationNumber: Number,
        vatRegisterationNumber: Number,
        companyRegisteredAddress: String,
        companyBillingAddress: String,
        businessCommenced: Date,
    },
    mainPointOfContact: {
        name: String,
        position: String,
        email: String,
        telephoneNumber: String,
        officeAddress: String,
    },
    accountContactDetails: {
        name: String,
        position: String,
        email: String,
        telephoneNumber: String,
        officeAddress: String,
    },
    additionalInfo: {
        type: String
    },
    workflowUpdates: {
        type: Boolean,
        default: false
    },
    marketingUpdates: {
            type: Boolean,
            default: false
    },
    emailSent: Boolean
});

export const clientAgent = mongoose.model<IClient>('client', clientSchema);