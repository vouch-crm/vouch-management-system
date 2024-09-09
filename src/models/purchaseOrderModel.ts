import mongoose, { Schema } from 'mongoose';

type purchaseOrderDTO = {
    empID: string,
    clientID: string,
    vendorName: string,
    description: string,
    monthOfReference: string,
    purchaseReason: string,
    estimatedTime: string,
    amount: number,
    bestRatePossibleConfirmation: boolean,
    date: Date,
    status: string,
    jobPhase: string,
    supplierType: string,
    PONumber: number,
    manager: Schema.Types.ObjectId,
}

const purchaseOrderSchema = new Schema({
    empID: {
        type: Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    clientID: {
        type: Schema.Types.ObjectId,
        ref: 'client',
        required: true
    },
    vendorName: String,
    description: String,
    monthOfReference: String,
    purchaseReason: String,
    estimatedTime: String,
    amount: Number,
    bestRatePossibleConfirmation: Boolean,
    date: Date,
    status: {
        type: String,
        default: 'pending'
    },
    jobPhase: String,
    supplierType: {
        type: String,
        default: '-'
    },
    PONumber: {
        type: Number,
        default: 0
    },
    manager: Schema.Types.ObjectId

}, { timestamps: true });



const purchaseOrderAgent = mongoose.model<purchaseOrderDTO>('purchaseOrder', purchaseOrderSchema);

export { purchaseOrderDTO, purchaseOrderAgent }