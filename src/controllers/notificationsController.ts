import { sendNotification, markNotificationsRead, getNotifications } from "../services/notificationsServices";
import { Notification } from "../models/notificationModel";
import express, { Request, Response } from 'express'

const router = express.Router()

const send = async (req: Request, res: Response) => {
    try {
        const body: Notification = req.body
        const notification = await sendNotification(body)
        res.status(201).json(notification.message)
    } catch (error) {
        res.status(400).json(error)
    }
}

const markRead = async (req: Request, res: Response) => {
    try {
        const empID = req.params.empID
        const markRead = await markNotificationsRead(empID)
        res.status(201).json(markRead.message)
    } catch (error) {
        res.status(400).json(error)
    }
}

const get = async (req: Request, res: Response) => {
    try {
        const empID = req.params.empID
        const notifications = await getNotifications(empID)
        res.status(200).json(notifications)
    } catch (error) {
        res.status(400).json(error)
    }
}

router.post('/notifications', sendNotification)
router.patch('/notifications/:empID', markRead)
router.get('/notifications/:empID', get)

export default router

