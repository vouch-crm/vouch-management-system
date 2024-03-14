import { dashboardServices } from "../services/dashboardServices";
import exprees, {Request, Response} from 'express';

const dashboradRouter = exprees.Router();

const dashboardStats1 = async (req: Request, res: Response) => {
    const startDate = new Date(req.params.startDate as string);
    const endDate = new Date(req.params.endDate as string);
    console.log(startDate, endDate);
    const dbResponse = await dashboardServices.dashboardStats1(startDate, endDate);

    res.status(200).json({
        response: dbResponse
    })
}

dashboradRouter.get('/dashboard-stats-1/:startDate/:endDate', dashboardStats1);

export default dashboradRouter;