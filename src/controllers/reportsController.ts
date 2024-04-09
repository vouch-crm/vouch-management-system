import { Router, Request, Response } from 'express'
import { getWorkHoursPerDay, getMonthlyCostPerClient, getEntriesWithinPeriod } from '../services/reportsServices'

const reportsRouter = Router()

const getBarData = async (req: Request, res: Response) => {
    try {
        const { startDate, endDate } = req.params
        const sDate = new Date(startDate)
        const eDate = new Date(endDate)
        const data = await getWorkHoursPerDay(sDate, eDate)
        res.status(200).json(data)
    } catch (error) {
        res.status(400)
    }

}

const getClientMonthlyCost = async (req: Request, res: Response) => {
    try {
        const { clientID } = req.params
        const thisMonth = new Date().getMonth() +1
        const data = await getMonthlyCostPerClient(thisMonth, clientID)
        res.status(200).json(data)
        
    } catch (error) {
        res.status(400)
    }

}

const getEntriesByDates = async(req: Request, res: Response) => {
    try {
        const { startDate, endDate } = req.params
        const { pageNumber } = req.query as unknown as any
        const data = await getEntriesWithinPeriod(new Date(startDate), new Date(endDate), pageNumber)
        res.status(200).json(data)
    } catch (error) {
        res.status(400)
    }
}

reportsRouter.get('/reports-bar/:startDate/:endDate', getBarData)
reportsRouter.get('/reports-entries/:startDate/:endDate', getEntriesByDates) 
reportsRouter.get('/client-monthly-cost/:clientID', getClientMonthlyCost)

export default reportsRouter















