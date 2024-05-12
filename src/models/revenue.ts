import mongoose, { Schema } from 'mongoose';

type monthData = {
    retainer: number,
    fees: {
        [key: string]: number,
    },
    totalBudget: number
}

type revenueDTO = {
    clientID: string,
    type: string,
    year: string,
    months: {
        [month: string]: monthData
    }
}

const monthSchema = new Schema({
    retainer: Number,
    fees: {
        type: Map,
        of: Number,
    },
    totalBudget: Number
})

const revenueSchema = new Schema({
    clientID: {
        type: Schema.Types.ObjectId,
        ref: 'Client',
        required: true
    },
    type: String,
    year: String,
    months: {
        type: Map,
        of: monthSchema
    },
    totalBudget: Number
});

const revenueAgent = mongoose.model<revenueDTO>('Revenue', revenueSchema);

export {revenueDTO, revenueAgent}