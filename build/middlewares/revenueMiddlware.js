"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.revenueMiddleware = void 0;
const revenueModel_1 = require("../models/revenueModel");
const checkClientIDAndYearExist = async (req, res, next) => {
    try {
        const { clientID, year } = req.body;
        const revenue = await revenueModel_1.revenueAgent.findOne({
            clientID: clientID,
            year: year
        });
        if (revenue) {
            return res.status(400).json({
                message: 'Client already exists for this year'
            });
        }
        next();
    }
    catch (error) {
        return res.status(400).json({
            message: `Error checking client ID and year: ${error}`
        });
    }
};
exports.revenueMiddleware = {
    checkClientIDAndYearExist
};
