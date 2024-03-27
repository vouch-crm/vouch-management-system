import mongoose, {Schema} from "mongoose";

export interface IClient{
    id?: string,
    clientBasicInfo: {
        name: string,
        email: string,
        companyName?: string,
        companyRegisterationNumber?: string,
        vatRegisterationNumber?: string,
        companyRegisteredAddress?: string,
        companyBillingAddress?: string,
        businessCommenced?: string,
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
    emailSent?: boolean,
    currency?: string
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
        companyRegisterationNumber: String,
        vatRegisterationNumber: String,
        companyRegisteredAddress: String,
        companyBillingAddress: String,
        businessCommenced: String,
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
    emailSent: Boolean,
    currency: String
});

export const clientAgent = mongoose.model<IClient>('client', clientSchema);