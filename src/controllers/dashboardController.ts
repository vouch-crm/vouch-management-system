import { dashboardServices } from "../services/dashboardServices";
import exprees, {Request, Response} from 'express';
import { serviceStatuses } from "../services/enums";

const dashboradRouter = exprees.Router();

const dashboardStats1 = async (req: Request, res: Response) => {
    const startDate = new Date(req.params.startDate as string);
    const endDate = new Date(req.params.endDate as string);
    const sectionOneStats = await dashboardServices.dashboardStats1(startDate, endDate);
    if(sectionOneStats.status !== serviceStatuses.SUCCESS) {
        return res.status(400).json({
            message: sectionOneStats.message
        });
    }

    res.status(200).json({
        data: sectionOneStats.data
    });
}

const dashboardStats2 = async (req: Request, res: Response) => {
    const startDate = new Date(req.params.startDate as string);
    const endDate = new Date(req.params.endDate as string);
    const sectionTwoStats = await dashboardServices.dashboardStats2(startDate, endDate);
    if(sectionTwoStats.status !== serviceStatuses.SUCCESS) {
        return res.status(400).json({
            message: sectionTwoStats.message
        });
    }

    res.status(200).json({
        data: sectionTwoStats.data
    });
}

const dashboardStats3 = async (req: Request, res: Response) => {
    const startDate = new Date(req.params.startDate as string);
    const endDate = new Date(req.params.endDate as string);
    const sectionThreeStats = await dashboardServices.dashboardStats3(startDate, endDate);
    if(sectionThreeStats.status !== serviceStatuses.SUCCESS) {
        return res.status(400).json({
            message: sectionThreeStats.message
        });
    }

    res.status(200).json({
        data: sectionThreeStats.data
    });
}

const dashboardStats4 = async (req: Request, res: Response) => {
    const startDate = new Date(req.params.startDate as string);
    const endDate = new Date(req.params.endDate as string);
    const sectionFourStats = await dashboardServices.dashboardStats4(startDate, endDate);
    if(sectionFourStats.status !== serviceStatuses.SUCCESS) {
        return res.status(400).json({
            message: sectionFourStats.message
        });
    }

    res.status(200).json({
        data: sectionFourStats.data
    });
}

dashboradRouter.get('/dashboard-stats-1/:startDate/:endDate', dashboardStats1);
dashboradRouter.get('/dashboard-stats-2/:startDate/:endDate', dashboardStats2);
dashboradRouter.get('/dashboard-stats-3/:startDate/:endDate', dashboardStats3);
dashboradRouter.get('/dashboard-stats-4/:startDate/:endDate', dashboardStats4);

export default dashboradRouter;