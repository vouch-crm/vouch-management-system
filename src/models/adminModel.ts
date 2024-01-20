import mongoose, {Schema} from 'mongoose'

export interface IAdmin {
    id?: string,
    name: string,
    email: string,
    password: string
}

const adminSchema: Schema = new Schema({
    email: {
        type: String,
        unique: true
    },
    name: {
        type: String
    },
    password: {
        type: String
    }
});

export const adminAgent = mongoose.model<IAdmin>('admin', adminSchema);