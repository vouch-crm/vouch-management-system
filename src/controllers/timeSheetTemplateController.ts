import { TimeSheetTemplateServices } from "../services/timeSheetTemplateServices";
import { serviceStatuses } from "../services/enums";
import express, {Request, Response} from 'express';
import { TimeSheetTemplateDTO } from "../models/timeSheetTemplate";

const timeSheetTemplateRouter = express.Router();

const create = async (req: Request, res: Response) => {
    const requestData: TimeSheetTemplateDTO = req.body;
    const newTemplate = await TimeSheetTemplateServices.create(requestData);
    if (newTemplate.status !== serviceStatuses.SUCCESS) {
        return res.status(400).json({
            message: newTemplate.message
        });
    }

    res.status(201).json({
        message: newTemplate.message,
        data: newTemplate.data
    });
}

const getAll = async (req: Request, res: Response) => {
    const templates = await TimeSheetTemplateServices.getAll();
    if (templates.status !== serviceStatuses.SUCCESS) {
        return res.status(400).json({
            message: templates.message
        });
    }

    res.status(200).json({
        data: templates.data
    });
}

const getByID = async (req: Request, res: Response) => {
    const ID = req.params.id;
    const template = await TimeSheetTemplateServices.getByID(ID);
    if (template.status === serviceStatuses.FAILED) {
        return res.status(404).json({
            message: template.message
        });
    } else if (template.status === serviceStatuses.ERROR) {
        return res.status(400).json({
            message: template.message
        });
    }

    res.status(200).json({
        data: template.data
    });
}

const getByEmployeeID = async (req: Request, res: Response) => {
    const empID = req.params.empID;
    const templates = await TimeSheetTemplateServices.getByEmployeeID(empID);
     if (templates.status === serviceStatuses.ERROR) {
        return res.status(400).json({
            message: templates.message
        });
    }

    res.status(200).json({
        data: templates.data
    });
}

const del = async (req: Request, res: Response) => {
    const ID = req.params.id;
    const deletedTemplate = await TimeSheetTemplateServices.del(ID);
    if (deletedTemplate.status === serviceStatuses.FAILED) {
        return res.status(404).json({
            message: deletedTemplate.message
        });
    } else if (deletedTemplate.status === serviceStatuses.ERROR) {
        return res.status(400).json({
            message: deletedTemplate.message
        });
    }

    res.status(200).json({
        data: deletedTemplate.message
    });
}

timeSheetTemplateRouter.post('/time-sheet-template', create);
timeSheetTemplateRouter.get('/time-sheet-template', getAll);
timeSheetTemplateRouter.get('/time-sheet-template/:id', getByID);
timeSheetTemplateRouter.get('/time-sheet-template-empID/:empID', getByEmployeeID);
timeSheetTemplateRouter.delete('/time-sheet-template/:id', del);

export default timeSheetTemplateRouter;