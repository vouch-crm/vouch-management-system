import mongoose, { Schema } from 'mongoose';

type monthData = {
    fees: {
        [key: string]: number,
    }
}

type costDTO = {
    clientID: string,
    type: string,
    year: string,
    months: {
        [month: string]: monthData
    }
}

const monthSchema = new Schema({
    fees: {
        type: Map,
        of: Number,
    },
},
    { _id: false }
)

const costSchema = new Schema({
    clientID: {
        type: Schema.Types.ObjectId,
        ref: 'client',
        required: true
    },
    type: String,
    year: String,
    months: {
        type: Map,
        of: monthSchema
    }
});

const costAgent = mongoose.model<costDTO>('Cost', costSchema);

export { costDTO, costAgent }