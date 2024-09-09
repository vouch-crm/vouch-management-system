"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const taskModel_1 = require("../models/taskModel");
const taskRouter = express_1.default.Router();
const createTask = async (req, res) => {
    try {
        const reqBody = req.body;
        const newTask = await taskModel_1.TaskAgent.create(reqBody);
        res.status(201).json(newTask);
    }
    catch (error) {
        res.status(400).json(error);
    }
};
const updateTask = async (req, res) => {
    try {
        const reqBody = req.body;
        const { id } = req.params;
        taskModel_1.TaskAgent.findByIdAndUpdate(id, reqBody);
        res.status(200);
    }
    catch (error) {
        res.status(400).json(error);
    }
};
const findTask = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await taskModel_1.TaskAgent.findById(id);
        res.status(200).json(task);
    }
    catch (error) {
        res.status(404).send(error);
    }
};
const findAllTasks = async (req, res) => {
    try {
        const tasks = await taskModel_1.TaskAgent.find().populate({
            path: 'projectID',
            populate: {
                path: 'clientID',
                model: 'client'
            }
        });
        res.status(200).json(tasks);
    }
    catch (error) {
        console.log(error);
        res.status(400).json(error);
    }
};
const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        taskModel_1.TaskAgent.findByIdAndDelete(id);
        res.status(200);
    }
    catch (error) {
        res.status(400);
    }
};
taskRouter.post('/task', createTask);
taskRouter.get('/task/:id', findTask);
taskRouter.get('/tasks', findAllTasks);
taskRouter.put('/task/:id', updateTask);
taskRouter.delete('/task/:id', deleteTask);
exports.default = taskRouter;
