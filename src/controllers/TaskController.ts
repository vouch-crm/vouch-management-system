import express, { Request, Response } from 'express'
import { TaskAgent } from '../models/taskModel'
import { jobAgent } from '../models/jobModel'

const taskRouter: express.Router = express.Router()

const createTask = async (req: Request, res: Response) => {
    try {
        const reqBody = req.body;
        if(!reqBody.jobID) {
            const newJob = await jobAgent.create({
                
            })
        }
        const newTask = await TaskAgent.create(reqBody);
        res.status(201).json(newTask);
        
    } catch (error) {
        res.status(400).json(error);
    }
}

const updateTask = async (req:Request, res:Response) => {
    try {
        const reqBody = req.body;
        const { id } = req.params;
        TaskAgent.findByIdAndUpdate(id, reqBody)
        res.status(200)
    } catch (error) {
        res.status(400).json(error)
    }
}

const findTask = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const task = await TaskAgent.findById(id)
        res.status(200).json(task)
    } catch (error) {
        res.status(404).send(error)
    }
}

const findAllTasks = async (req: Request, res: Response) => {
    try {
        const tasks = await TaskAgent.find()
        res.status(200).json(tasks)
    } catch (error) {
        res.status(400).json(error)
    }
}

const deleteTask = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        TaskAgent.findByIdAndDelete(id)
        res.status(200)
    } catch (error) {
        res.status(400)
    }
}

taskRouter.post('/task', createTask);
taskRouter.get('/task/:id', findTask);
taskRouter.get('/tasks', findAllTasks);
taskRouter.put('/task/:id', updateTask);
taskRouter.delete('/task/:id', deleteTask)

export default taskRouter