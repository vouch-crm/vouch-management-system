import { revenueAgent } from "../models/revenueModel";
import {Request, Response, NextFunction} from 'express';

const checkClientIDAndYearExist = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {clientID, year} = req.body;
        const revenue = await revenueAgent.findOne({
            clientID: clientID,
            year: year
        });

        if(revenue) {
            return res.status(400).json({
                message: 'Client already exists for this year'
            });
        }

        next();
    } catch (error) {
        return res.status(400).json({
            message: `Error checking client ID and year: ${error}`
        });
    }
}

export const revenueMiddleware = {
    checkClientIDAndYearExist
}