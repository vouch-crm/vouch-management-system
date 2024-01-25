import mongoose, {Schema} from 'mongoose'

type AdminDocument = {
    email: string;
    name: string;
    password: string;
    role?: string
}

type AdminInput = {
    email: AdminDocument['email'];
    password: AdminDocument['password'];
    role?: AdminDocument['role']
}

const adminSchema: Schema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    }
});

const AdminAgent = mongoose.model<AdminDocument>('Admin', adminSchema);

export { AdminDocument, AdminInput, AdminAgent }