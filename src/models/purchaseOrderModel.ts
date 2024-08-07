import mongoose, {Schema} from 'mongoose';

type purchaseOrderDTO = {
    empID: string,
    clientID: string,
    vendorName: string,
    monthOfReference: string,
    purchaseReason: string,
    estimatedTime: number,
    amount: number,
    bestRatePossibleConfirmation: boolean,
    date: Date,
    status: string
}

const purchaseOrderSchema = new Schema({
    empID: {
        type: Schema.Types.ObjectId,
        ref: 'employee',
        required: true
    },
    clientID: {
        type: Schema.Types.ObjectId,
        ref: 'client',
        required: true
    },
    vendorName: String,
    monthOfReference: String,
    purchaseReason: String,
    estimatedTime: Number,
    amount: Number,
    bestRatePossibleConfirmation: Boolean,
    date: Date,
    status: String
});

const purchaseOrderAgent = mongoose.model<purchaseOrderDTO>('purchaseOrder', purchaseOrderSchema);

export {purchaseOrderDTO, purchaseOrderAgent}