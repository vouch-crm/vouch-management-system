import express , { Router, Request, Response } from 'express'
import { TimesheetEntryModel } from '../models/timesheetEntryModel'

const create = async (req: Request, res: Response) => {
    try {
        const reqBody = req.body
        const timesheetEntry = await TimesheetEntryModel.create()
        res.status(201).json(timesheetEntry)
    } catch (error) {
        res.status(400).json(error)
    }
}