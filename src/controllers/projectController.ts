import { projectServices } from "../services/projectServices";
import { serviceStatuses } from "../services/enums";
import express, { Request, Response } from 'express';
import { projectDTO } from "../models/projectModel";
import { validationFunctions } from "../middlewares/validation";

const projectRouter = express.Router();

const create = async (req: Request, res: Response) => {
    const {clientID, name, budget} = req.body;
    const projectData: projectDTO = {
        clientID,
        name,
        budget
    }

    const newProject = await projectServices.create(projectData);

    if (newProject.status !== serviceStatuses.SUCCESS) {
        return res.status(400).json({
            message: newProject.message
        });
    }

    res.status(201).json({
        message: newProject.message,
        data: newProject.data
    });
}

const getAll = async (req: Request, res: Response) => {
    const projects = await projectServices.getAll();

    if (projects.status !== serviceStatuses.SUCCESS) {
        return res.status(400).json({
            message: projects.message
        });
    }

    res.status(200).json({
        data: projects.data
    });
}

const getByID = async (req: Request, res: Response) => {
    const ID = req.params.id;

    const project = await projectServices.getByID(ID);

    if (project.status === serviceStatuses.FAILED) {
        return res.status(404).json({
            message: project.message
        });
    }
    else if(project.status === serviceStatuses.ERROR) {
        return res.status(400).json({
            message: project.message
        });
    }

    res.status(200).json({
        data: project.data
    });
}

const del = async (req: Request, res: Response) => {
    const ID = req.params.id;

    const deletedProject = await projectServices.del(ID);

    if (deletedProject.status === serviceStatuses.FAILED) {
        return res.status(404).json({
            message: deletedProject.message
        });
    } else if (deletedProject.status === serviceStatuses.ERROR) {
        return res.status(400).json({
            message: deletedProject.message
        });
    }

    res.status(200).json({
        message: deletedProject.message
    });
}

projectRouter.post('/project', validationFunctions.createProjectBodyValidationRules(),
validationFunctions.validationMiddleware, create);
projectRouter.get('/project', getAll);
projectRouter.get('/project/:id', getByID);
projectRouter.delete('/project/:id', del);

export default projectRouter;