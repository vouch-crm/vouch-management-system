"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const timesheetEntryModel_1 = require("../models/timesheetEntryModel");
const create = async (req, res) => {
    try {
        const reqBody = req.body;
        const timesheetEntry = await timesheetEntryModel_1.TimesheetEntryModel.create();
        res.status(201).json(timesheetEntry);
    }
    catch (error) {
        res.status(400).json(error);
    }
};
