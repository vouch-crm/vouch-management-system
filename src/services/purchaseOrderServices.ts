import { purchaseOrderDTO, purchaseOrderAgent } from "../models/purchaseOrderModel";
import { serviceStatuses } from "./enums";

export type purchaseOrderReturn = {
    status: string,
    message: string | null,
    data: Record<string, any> | null
}

const create = async (purchaseOrderData: purchaseOrderDTO): Promise<purchaseOrderReturn> => {
    try {
        const newPurchaseOrder = await purchaseOrderAgent.create(purchaseOrderData);

        return {
            status: serviceStatuses.SUCCESS,
            message: 'order placed successfuly!',
            data: newPurchaseOrder
        }

    } catch (error) {
        return {
            status: serviceStatuses.ERROR,
            message: `Error placing new order: ${error}`,
            data: null
        }
    }
}

export const purchaseOrderServices = {
    create
}