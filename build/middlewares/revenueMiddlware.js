"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.revenueMiddleware = void 0;
const revenueModel_1 = require("../models/revenueModel");
const checkClientIDAndYearExist = async (req, res, next) => {
    try {
        const { clientID, year, type } = req.body;
        const revenue = await revenueModel_1.revenueAgent.findOne({
            clientID: clientID,
            year: year,
            type: type
        });
        if (revenue) {
            return res.status(400).json({
                message: 'Client data already exists!'
            });
        }
        next();
    }
    catch (error) {
        return res.status(400).json({
            message: `Error checking client ID existance: ${error}`
        });
    }
};
exports.revenueMiddleware = {
    checkClientIDAndYearExist
};
