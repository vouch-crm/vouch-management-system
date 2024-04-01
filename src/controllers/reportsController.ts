import { Router, Request, Response } from 'express';
import { getWorkHoursPerDay, getMonthlyCostPerClient } from '../services/reportsServices';
import { reportServices } from '../services/reportsServices';

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
    // try {
        const { clientID } = req.params
        const thisMonth = new Date().getMonth() +1
        const data = await getMonthlyCostPerClient(thisMonth, clientID)
        res.status(200).json(data)
        
    // } catch (error) {
    //     res.status(400)
    // }

}

const getClientTotalHoursAndHoursPerDay = async (
    req: Request, res: Response) => {
    const clientID = req.params.clientID;
    const startDate = new Date(req.params.startDate as string);
    const endDate = new Date(req.params.endDate as string);
    const report = await reportServices
        .getClientTotalHoursAndHoursPerDay(clientID, startDate, endDate);

    res.status(200).json({
        data: report
    });
}

const getEmployeeTotalRevenue = async (
    req: Request, res: Response) => {
    const startDate = new Date(req.params.startDate as string);
    const endDate = new Date(req.params.endDate as string);
    const report = await reportServices.getEmployeeTotalRevenue(startDate, endDate);

    res.status(200).json({
        data: report
    });
}

reportsRouter.get('/reports-bar/:startDate/:endDate', getBarData);
reportsRouter.get('/client-monthly-cost/:clientID', getClientMonthlyCost);
reportsRouter.get('/report-client/:clientID/:startDate/:endDate',
    getClientTotalHoursAndHoursPerDay);
reportsRouter.get('/report-employee-revenues/:startDate/:endDate', getEmployeeTotalRevenue);


export default reportsRouter















