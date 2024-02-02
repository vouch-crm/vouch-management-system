"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const employeeServices_1 = require("../services/employeeServices");
const hashingServices_1 = require("../services/hashingServices");
const validation_1 = require("../middlewares/validation");
const adminMiddleware_1 = require("../middlewares/adminMiddleware");
const tokenServices_1 = require("../services/tokenServices");
const s3Services_1 = require("../services/s3Services");
const multer_1 = __importDefault(require("multer"));
const multerImageFilter_1 = require("../services/multerImageFilter");
const upload = (0, multer_1.default)({
    fileFilter: multerImageFilter_1.imageFilter
});
const employeeRouter = express_1.default.Router();
const create = async (req, res) => {
    const requestData = req.body;
    const probationDate = employeeServices_1.employeeServices.generateProbationDate(requestData.joinDate);
    const password = await hashingServices_1.hashingServices.hashPassword(employeeServices_1.employeeServices.passwordGenerator(requestData.email));
    const employeeData = requestData;
    employeeData.probationDate = probationDate;
    employeeData.password = password;
    const dbResponse = await employeeServices_1.employeeServices.create(employeeData);
    if (dbResponse.status === 'Error') {
        return res.status(400).json({
            message: dbResponse.message
        });
    }
    res.status(201).json({
        message: dbResponse.message,
        data: dbResponse.data
    });
};
const login = async (req, res) => {
    const requestData = req.body;
    const dbResponse = await employeeServices_1.employeeServices.getEmployeeByEmail(requestData.email);
    if (dbResponse.status === 'Failed') {
        return res.status(404).json({
            message: 'Invalid email or password'
        });
    }
    else if (dbResponse.status === 'Error') {
        return res.status(400).json({
            error: dbResponse.message
        });
    }
    const employeePassword = dbResponse.data?.password;
    const passwordChecker = await hashingServices_1.hashingServices.verifyHash(requestData.password, employeePassword);
    if (!passwordChecker) {
        return res.status(400).json({
            message: 'Invalid email or password!'
        });
    }
    const employeeID = dbResponse.data?.id;
    const employeeEmail = dbResponse.data?.email;
    const tokenResponse = tokenServices_1.tokenServices.generateToken(employeeID, employeeEmail);
    if (tokenResponse.status === 'Success') {
        res.status(200).json({
            token: tokenResponse.token,
            data: dbResponse.data
        });
        console.log(dbResponse.data);
    }
    else {
        res.status(400).json({
            message: tokenResponse.message
        });
    }
};
const getAll = async (req, res) => {
    const dbResponse = await employeeServices_1.employeeServices.getAll();
    if (dbResponse.status === 'Error') {
        return res.status(400).json({
            message: dbResponse.message
        });
    }
    res.status(200).json({
        data: dbResponse.data
    });
};
const getEmployeeByID = async (req, res) => {
    const ID = req.params.id;
    const dbResponse = await employeeServices_1.employeeServices.getEmployeeByID(ID);
    if (dbResponse.status === 'Failed') {
        return res.status(404).json({
            message: dbResponse.message
        });
    }
    else if (dbResponse.status === 'Error') {
        return res.status(400).json({
            message: dbResponse.message
        });
    }
    res.status(200).json({
        data: dbResponse.data
    });
};
const del = async (req, res) => {
    const id = req.params.id;
    const dbResponse = await employeeServices_1.employeeServices.del(id);
    if (dbResponse.status === 'Failed') {
        return res.status(404).json({
            message: dbResponse.message
        });
    }
    else if (dbResponse.status === 'Error') {
        return res.status(400).json({
            message: dbResponse.message
        });
    }
    res.status(200).json({
        message: dbResponse.message
    });
};
const update = async (req, res) => {
    const id = req.params.id;
    const updatedEmployee = req.body;
    const dbResponse = await employeeServices_1.employeeServices.update(id, updatedEmployee);
    if (dbResponse.status === 'Failed') {
        return res.status(404).json({
            message: dbResponse.message
        });
    }
    else if (dbResponse.status === 'Error') {
        return res.status(400).json({
            message: dbResponse.message
        });
    }
    res.status(200).json({
        message: dbResponse.message,
        data: dbResponse.data
    });
};
const uploadImage = async (req, res) => {
    try {
        const employeeID = req.query.id;
        const uploadParams = {
            Bucket: 'vouch-crm',
            Key: req.file?.originalname || '',
            Body: req.file?.buffer || '',
        };
        const result = await s3Services_1.s3.upload(uploadParams).promise();
        const employeeData = {
            image: result.Location
        };
        const dbResponse = await employeeServices_1.employeeServices.update(employeeID, employeeData);
        if (dbResponse.status === 'failed') {
            return res.status(400).json({
                message: dbResponse.message
            });
        }
        else if (dbResponse.status === 'error') {
            return res.status(500).json({
                message: dbResponse.message
            });
        }
        res.status(201).json({
            message: 'file uploaded successfuly!'
        });
    }
    catch (error) {
        console.log(error);
        res.status(500);
    }
};
employeeRouter.post('/employee', adminMiddleware_1.checkIfAdmin, validation_1.validationFunctions.createEmployeeBodyValidationRules(), validation_1.validationFunctions.validationMiddleware, create);
employeeRouter.post('/employee-login', login);
employeeRouter.get('/employee', adminMiddleware_1.checkIfAdmin, getAll);
employeeRouter.get('/employee/:id', adminMiddleware_1.checkIfAdmin, getEmployeeByID);
employeeRouter.delete('/employee/:id', adminMiddleware_1.checkIfAdmin, del);
employeeRouter.put('/employee/:id', adminMiddleware_1.checkIfAdmin, update);
employeeRouter.post('/employee-image', upload.single('file'), uploadImage);
exports.default = employeeRouter;
