"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const costModel_1 = require("../models/costModel");
const revenueModel_1 = require("../models/revenueModel");
const reportsServices_1 = require("../services/reportsServices");
const clientServices_1 = require("../services/clientServices");
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
            const feePath = `months.${month}.fees.${feeName}`;
            const totalCostPath = `months.${month}.totalCost`;
            // @ts-ignore
            const feesArray = oldCost.months.get(month) ? Array.from(oldCost.months.get(month).fees.values()) : [];
            // @ts-ignore
            await costModel_1.costAgent.updateOne({ clientID: req.body.clientID }, {
                $set: {
                    [feePath]: feeValue,
                    [totalCostPath]: feesArray.length > 0 ? feesArray.reduce((sum, num) => sum + num, feeValue) : feeValue
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
                        },
                        totalCost: feeValue
                    }
                }
            };
            const newCost = await costModel_1.costAgent.create(objectToCreate);
            res.status(201).json(newCost);
        }
    }
    catch (error) {
        console.log(error);
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
const setTimeCostForClients = async () => {
    try {
        const months = {
            'Jan': 1,
            'Feb': 2,
            'Mar': 3,
            'Apr': 4,
            'May': 5,
            'Jun': 6,
            'Jul': 7,
            'Aug': 8,
            'Sep': 9,
            'Oct': 10,
            'Nov': 11,
            'Dec': 12
        };
        const dbResponse = await clientServices_1.clientServices.find();
        // @ts-ignore
        const clients = dbResponse?.data?.map((client) => client._id.toString());
        console.log(clients);
        clients.forEach(async (client) => {
            const oldCost = await costModel_1.costAgent.findOne({ clientID: client });
            Object.keys(months).forEach(async (month) => {
                // @ts-ignore
                const timeCostPerMonth = await (0, reportsServices_1.getMonthlyCostPerClient)(months[month], client);
                console.log(`${month}: `, timeCostPerMonth);
                if (timeCostPerMonth[0]) {
                    if (oldCost) {
                        const feePath = `months.${month}.fees.Time`;
                        const totalCostPath = `months.${month}.totalCost`;
                        // @ts-ignore
                        const feesArray = oldCost.months.get(month) ? Array.from(oldCost.months.get(month).fees.values()) : [];
                        // @ts-ignore
                        const res = await costModel_1.costAgent.updateOne({ clientID: client }, {
                            $set: {
                                [feePath]: timeCostPerMonth[0].totalCost,
                                [totalCostPath]: feesArray.length > 0 ? feesArray.reduce((sum, num) => sum + num, timeCostPerMonth[0].totalCost) : timeCostPerMonth[0].totalCost
                            }
                        }, { new: true });
                    }
                    else {
                        const objectToCreate = {
                            clientID: client,
                            type: 'Cost',
                            year: new Date().getMonth() > 10 ? `${(new Date().getFullYear() - 1).toString().substring(2)}/${(new Date().getFullYear()).toString().substring(2)}` : `${(new Date().getFullYear()).toString().substring(2)}/${(new Date().getFullYear() + 1).toString().substring(2)}`,
                            months: {
                                [month]: {
                                    fees: {
                                        'Time': timeCostPerMonth[0].totalCost
                                    },
                                    totalCost: timeCostPerMonth[0].totalCost
                                }
                            }
                        };
                        console.log(objectToCreate.year);
                        const newCost = await costModel_1.costAgent.create(objectToCreate);
                    }
                }
            });
        });
    }
    catch (error) {
        throw new Error(`Error: ${error}`);
    }
};
const getCost = async (req, res) => {
    try {
        await setTimeCostForClients();
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
router.post('/cost', addOrUpdateFee);
router.get('/cost', getCost);
exports.default = router;
