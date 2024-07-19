import { costAgent, costDTO } from "../models/costModel";
import { revenueAgent, revenueDTO } from "../models/revenueModel";
import { getMonthlyCostPerClient } from '../services/reportsServices';
import { clientServices, IReturnClient } from '../services/clientServices';
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
    }

    const dbResponse: IReturnClient = await clientServices.find();
    // @ts-ignore
    const clients = dbResponse?.data?.map((client: any) => client._id.toString())
    console.log(clients)
    clients.forEach(async (client: string) => {
      const oldCost = await costAgent.findOne({ clientID: client })
      Object.keys(months).forEach(async (month: string) => {
        // @ts-ignore
        const timeCostPerMonth = await getMonthlyCostPerClient(months[month], client)
        console.log(`${month}: `, timeCostPerMonth)
        if (timeCostPerMonth[0]) {
          if (oldCost) {
            const feePath = `months.${month}.fees.Time`
            const totalCostPath = `months.${month}.totalCost`
            // @ts-ignore
            const feesArray = oldCost.months.get(month) ? Array.from(oldCost.months.get(month).fees.values()) : []
            // @ts-ignore
            const res = await costAgent.updateOne({ clientID: client }, {
              $set: {
                [feePath]: timeCostPerMonth[0].totalCost,
                [totalCostPath]: feesArray.length > 0 ? feesArray.reduce((sum: any, num: any) => sum + num, timeCostPerMonth[0].totalCost) : timeCostPerMonth[0].totalCost
              }
            }, { new: true })
          } else {
            const objectToCreate: costDTO = {
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
            }
            console.log(objectToCreate.year)
            const newCost = await costAgent.create(objectToCreate)
          }
        }
      })
    })
  } catch (error) {
    throw new Error(`Error: ${error}`)
  }
}


const getCost = async (req: Request, res: Response) => {
  try {
    await setTimeCostForClients()
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
