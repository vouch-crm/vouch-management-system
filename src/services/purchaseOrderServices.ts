import { purchaseOrderDTO, purchaseOrderAgent } from "../models/purchaseOrderModel";
import { serviceStatuses } from "./enums";

export type purchaseOrderReturn = {
    status: string,
    message: string | null,
    data: Record<string, any> | null
}

const create = async (purchaseOrderData: purchaseOrderDTO): Promise<purchaseOrderReturn> => {
    try {
        const count = await purchaseOrderAgent.countDocuments()
        const newPurchaseOrder = await purchaseOrderAgent.create({...purchaseOrderData, PONumber: count +1});

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

const getAll = async (): Promise<purchaseOrderReturn> => {
    try {
        const orders = await purchaseOrderAgent.find()
            .populate('empID', 'firstName lastName')
            .populate('clientID', 'clientBasicInfo');

        return {
            status: serviceStatuses.SUCCESS,
            message: null,
            data: orders
        }

    } catch (error) {
        return {
            status: serviceStatuses.ERROR,
            message: `Error fetching purchase orders: ${error}`,
            data: null
        }
    }
}

const getEmployeeOrders = async (empID: string): Promise<purchaseOrderReturn> => {
    try {
        const employeeOrders = await purchaseOrderAgent.find({ empID })
            .populate('empID', 'firstName lastName')
            .populate('clientID', 'clientBasicInfo');

        if (!employeeOrders) {
            return {
                status: serviceStatuses.FAILED,
                message: 'No orders matching this ID!',
                data: null
            }
        }

        return {
            status: serviceStatuses.SUCCESS,
            message: null,
            data: employeeOrders
        }

    } catch (error) {
        return {
            status: serviceStatuses.ERROR,
            message: `Error fetching employee purchase orders: ${error}`,
            data: null
        }
    }
}

const update = async (ID: string, status: string): Promise<purchaseOrderReturn> => {
    try {
        const updatedOrder = await purchaseOrderAgent.findByIdAndUpdate(ID,
            {
                status: status,
            },
            {
                new: true
            }
        );

        if (!updatedOrder) {
            return {
                status: serviceStatuses.FAILED,
                message: 'No order matching this ID!',
                data: null
            }
        }

        return {
            status: serviceStatuses.SUCCESS,
            message: 'Order Updated successfuly!',
            data: updatedOrder
        }

    } catch (error) {
        return {
            status: serviceStatuses.ERROR,
            message: `Error updating purchase order: ${error}`,
            data: null
        }
    }
}

const updateOrderInfo = async(ID: string, orderData: Record<string, any>): Promise<purchaseOrderReturn> => {
    try {
        const updatedOrder = await purchaseOrderAgent.findByIdAndUpdate(ID, orderData,
            {
                new: true
            }
        );

        if (!updatedOrder) {
            return {
                status: serviceStatuses.FAILED,
                message: 'No order matching this ID!',
                data: null
            }
        }

        return {
            status: serviceStatuses.SUCCESS,
            message: 'Order Updated successfuly!',
            data: updatedOrder
        }

    } catch (error) {
        return {
            status: serviceStatuses.ERROR,
            message: `Error updating purchase order: ${error}`,
            data: null
        }
    }
}

const del = async (ID: string): Promise<purchaseOrderReturn> => {
    try {
        const deletedOrder = await purchaseOrderAgent.findByIdAndDelete(ID);

        if (!deletedOrder) {
            return {
                status: serviceStatuses.FAILED,
                message: 'No order matching this ID!',
                data: null
            }
        }

        return {
            status: serviceStatuses.SUCCESS,
            message: 'Order deleted successfuly!',
            data: deletedOrder
        }

    } catch (error) {
        return {
            status: serviceStatuses.ERROR,
            message: `Error deleting purchase order: ${error}`,
            data: null
        }
    }
}

export const purchaseOrderServices = {
    create,
    getAll,
    getEmployeeOrders,
    update,
    updateOrderInfo,
    del
}