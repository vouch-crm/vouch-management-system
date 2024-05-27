import { revenueAgent } from "../models/revenueModel";
import {Request, Response, NextFunction} from 'express';

const checkClientIDAndYearExist = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {clientID, year, type} = req.body;
        const revenue = await revenueAgent.findOne({
            clientID: clientID,
            year: year,
            type: type
        });

        if(revenue) {
            return res.status(400).json({
                message: 'Client data already exists!'
            });
        }

        next();
    } catch (error) {
        return res.status(400).json({
            message: `Error checking client ID existance: ${error}`
        });
    }
}

export const revenueMiddleware = {
    checkClientIDAndYearExist
}