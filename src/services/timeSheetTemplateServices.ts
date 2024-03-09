import { TimeSheetTemplateDTO, TimeSheetTemplateAgent } from "../models/timeSheetTemplate";
import { serviceStatuses } from "./enums";

type TimeSheetTemplateReturn = {
    status: string,
    message: string | null,
    data: Record<string, any> | null
}

const create = async (templateData: TimeSheetTemplateDTO): Promise<TimeSheetTemplateReturn> => {
    try {
        const newTemplate = await TimeSheetTemplateAgent.create(templateData);

        return {
            status: serviceStatuses.SUCCESS,
            message: 'Template created successfuly!',
            data: newTemplate
        }
    } catch (error) {
        return {
            status: serviceStatuses.ERROR,
            message: `Error creating a template: ${error}`,
            data: null
        }
    }
}

const getAll = async (): Promise<TimeSheetTemplateReturn> => {
    try {
        const templates = await TimeSheetTemplateAgent.find();
        return {
            status: serviceStatuses.SUCCESS,
            message: null,
            data: templates
        }
    } catch (error) {
        return {
            status: serviceStatuses.ERROR,
            message: `Error getting templates: ${error}`,
            data: null
        }
    }
}

const getByID = async (ID: string): Promise<TimeSheetTemplateReturn> => {
    try {
        const template = await TimeSheetTemplateAgent.findById(ID);
        if (!template) {
            return {
                status: serviceStatuses.FAILED,
                message: `No template matching ID: ${ID}`,
                data: null
            }    
        }

        return {
            status: serviceStatuses.SUCCESS,
            message: null,
            data: template
        }
    } catch (error) {
        return {
            status: serviceStatuses.ERROR,
            message: `Error getting template: ${error}`,
            data: null
        }
    }
}

const getByEmployeeID = async (employeeID: string): Promise<TimeSheetTemplateReturn> => {
    try {
        const templates = await TimeSheetTemplateAgent.find({employeeID: employeeID});
        
        return {
            status: serviceStatuses.SUCCESS,
            message: null,
            data: templates
        }
    } catch (error) {
        return {
            status: serviceStatuses.ERROR,
            message: `Error getting templates: ${error}`,
            data: null
        }
    }
}

const del = async (ID: string): Promise<TimeSheetTemplateReturn> => {
    try {
        const template = await TimeSheetTemplateAgent.findByIdAndDelete(ID);
        if (!template) {
            return {
                status: serviceStatuses.FAILED,
                message: `No template matching ID: ${ID}`,
                data: null
            }    
        }

        return {
            status: serviceStatuses.SUCCESS,
            message: 'Template deleted successfuly!',
            data: null
        }
    } catch (error) {
        return {
            status: serviceStatuses.ERROR,
            message: `Error deleting template: ${error}`,
            data: null
        }
    }
}

export const TimeSheetTemplateServices = {
    create,
    getAll,
    getByID,
    getByEmployeeID,
    del
}