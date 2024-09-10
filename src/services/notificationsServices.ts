import { Notification, NotificationModel } from "../models/notificationModel";
import { serviceStatuses } from "./enums";

export type notificationReturn = {
    status: string,
    message: string | null,
    data: Record<string, any> | null
}

const sendNotification = async (notificationData: Notification): Promise<notificationReturn> => {
    try {
        const notification = await NotificationModel.create(notificationData)
        return {
            status: serviceStatuses.SUCCESS,
            message: 'Notification sent successfully.',
            data: notification
        }
    } catch (error) {
        return {
            status: serviceStatuses.ERROR,
            message: 'Error sending notification.',
            data: null
        }
    }
}

const markNotificationsRead = async (empID: string): Promise<notificationReturn> => {
    try {
        await NotificationModel.updateMany({ empID }, { read: true })
        return {
            status: serviceStatuses.SUCCESS,
            message: 'Notifications updated successfully.',
            data: null
        }
    } catch (error) {
        return {
            status: serviceStatuses.ERROR,
            message: 'Error updating notifications.',
            data: null
        }
    }
}

const getNotifications = async (empID: string): Promise<notificationReturn> => {
    try {
        const notifications = await NotificationModel.find({empID}).sort({ createdAt: -1 }).limit(5)
        return {
            status: serviceStatuses.SUCCESS,
            message: 'Notifications retrieved successfully.',
            data: notifications
        }

    } catch (error) {
        return {
            status: serviceStatuses.ERROR,
            message: 'Error retrieving notifications.',
            data: null
        }
    }
}

export { sendNotification, markNotificationsRead, getNotifications }