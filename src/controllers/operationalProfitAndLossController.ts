import { costAgent, costDTO } from "../models/costModel";
import { revenueAgent, revenueDTO } from "../models/revenueModel";
import express, { Request, Response } from 'express';
const router = express.Router()

interface GroupedResult {
  [x: string]: any;
}

const addOrUpdateFee = async (req: Request, res: Response) => {
  try {
    const reqBody = req.body
    const month = reqBody.month
    const feeName = reqBody.feeName
    const feeValue = reqBody.feeValue
    const oldCost = await costAgent.findOne({ clientID: reqBody.clientID })
    if (oldCost) {
      const feePath = `months.${month}.fees.${feeName}`
      const totalCostPath = `months.${month}.totalCost`
      // @ts-ignore
      const feesArray = oldCost.months.get(month) ? Array.from(oldCost.months.get(month).fees.values()) : [] 
      // @ts-ignore
      await costAgent.updateOne({ clientID: req.body.clientID }, {
        $set: {
          [feePath]: feeValue,
          [totalCostPath]: feesArray.length > 0 ? feesArray.reduce((sum: any, num: any) => sum + num, feeValue) : feeValue
        }
      }, { new: true })
      res.status(200).json('Fee Added!')
    } else {
      const objectToCreate: costDTO = {
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
      }
      const newCost = await costAgent.create(objectToCreate)
      res.status(201).json(newCost)
    }
  } catch (error) {
    console.log(error)
    res.status(400).json(error)
  }
}

const groupByClientID = (costData: any, revenueData: any) => {
  const grouped: GroupedResult = {};

  costData.forEach((cost: any) => {
    const clientName = cost.clientID.clientBasicInfo.name;
    if (!grouped[clientName]) {
      grouped[clientName] = { costData: {}, revenueData: {} };
    }
    cost.clientID = cost.clientID._id
    grouped[clientName].costData = cost;
  });

  revenueData.forEach((revenue: any) => {
    const clientName = revenue.clientID.clientBasicInfo.name;
    if (!grouped[clientName]) {
      grouped[clientName] = { costData: {}, revenueData: {} };
    }
    revenue.clientID = revenue.clientID._id
    grouped[clientName].revenueData = revenue;
  });

  return grouped;
};


const getCost = async (req: Request, res: Response) => {
  try {
    const costData = await costAgent.find().populate({ path: 'clientID', select: 'clientBasicInfo.name' })
    const revenueData = await revenueAgent.find({ type: 'Confirmed' }).populate({ path: 'clientID', select: 'clientBasicInfo.name' })
    const data = groupByClientID(costData, revenueData)
    res.status(200).json(data)
  } catch (error) {
    console.log(error)
    res.status(400).json(error)
  }
}




router.post('/cost', addOrUpdateFee)
router.get('/cost', getCost)

export default router
