"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const costModel_1 = require("../models/costModel");
const revenueModel_1 = require("../models/revenueModel");
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const addOrUpdateFee = async (req, res) => {
    try {
        const reqBody = req.body;
        const month = reqBody.month;
        const feeName = reqBody.feeName;
        const feeValue = reqBody.feeValue;
        const oldCost = await costModel_1.costAgent.findOne({ clientID: reqBody.clientID });
        if (oldCost) {
            const path = `months.${month}.fees.${feeName}`;
            await costModel_1.costAgent.updateOne({ clientID: req.body.clientID }, {
                $set: {
                    [path]: feeValue
                }
            }, { new: true });
            res.status(200).json('Fee Added!');
        }
        else {
            const objectToCreate = {
                clientID: reqBody.clientID,
                type: reqBody.type,
                year: reqBody.year,
                months: {
                    [month]: {
                        fees: {
                            [feeName]: feeValue
                        }
                    }
                }
            };
            const newCost = await costModel_1.costAgent.create(objectToCreate);
            res.status(201).json(newCost);
        }
    }
    catch (error) {
        res.status(400).json(error);
    }
};
const groupByClientID = (costData, revenueData) => {
    const grouped = {};
    costData.forEach((cost) => {
        const clientName = cost.clientID.clientBasicInfo.name;
        if (!grouped[clientName]) {
            grouped[clientName] = { costData: {}, revenueData: {} };
        }
        cost.clientID = cost.clientID._id;
        grouped[clientName].costData = cost;
    });
    revenueData.forEach((revenue) => {
        const clientName = revenue.clientID.clientBasicInfo.name;
        if (!grouped[clientName]) {
            grouped[clientName] = { costData: {}, revenueData: {} };
        }
        revenue.clientID = revenue.clientID._id;
        grouped[clientName].revenueData = revenue;
    });
    return grouped;
};
const getCost = async (req, res) => {
    try {
        const costData = await costModel_1.costAgent.find().populate({ path: 'clientID', select: 'clientBasicInfo.name' });
        const revenueData = await revenueModel_1.revenueAgent.find({ type: 'Confirmed' }).populate({ path: 'clientID', select: 'clientBasicInfo.name' });
        const data = groupByClientID(costData, revenueData);
        res.status(200).json(data);
    }
    catch (error) {
        console.log(error);
        res.status(400).json(error);
    }
};
const update = async (req, res) => {
    try {
        const reqBody = req.body;
        const newCost = await costModel_1.costAgent.findOneAndUpdate({ clientID: reqBody.clientID }, reqBody);
        res.status(200).json(newCost);
    }
    catch (error) {
        console.log(error);
        res.status(400).json(error);
    }
};
router.post('/cost', addOrUpdateFee);
router.get('/cost', getCost);
router.put('/cost', update);
exports.default = router;
