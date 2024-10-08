import mongoose, { Schema } from 'mongoose';

type Notification = {
    empID: Schema.Types.ObjectId;
    read: boolean;
    message: string;
}

const notificationSchema: Schema = new Schema({
    empID: {
        type: Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    read: {
        type: Boolean,
        default: false
    },
    message: String
},{timestamps: true})

const NotificationModel = mongoose.model<Notification>('Notification', notificationSchema)
export { Notification, NotificationModel }