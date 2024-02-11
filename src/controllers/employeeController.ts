import express, { Request, Response } from 'express'
import { employeeServices, EmployeeReturn } from '../services/employeeServices'
import { hashingServices } from '../services/hashingServices'
import { EmployeeDocument, EmployeeInput, EmployeeLogin } from '../models/employeeModel'
import { validationFunctions } from '../middlewares/validation'
import { checkIfAdmin } from '../middlewares/adminMiddleware'
import { tokenServices } from '../services/tokenServices'
import { s3 } from '../services/s3Services';
import multer from "multer";
import { imageFilter } from '../services/multerImageFilter'

const upload = multer({
    fileFilter: imageFilter
});



const employeeRouter = express.Router();

const create = async (req: Request, res: Response) => {
    const requestData: EmployeeInput = req.body;

    const probationDate = employeeServices.generateProbationDate(requestData.joinDate);
    const password = await hashingServices.hashPassword(
        employeeServices.passwordGenerator(requestData.email));

    const employeeData: EmployeeDocument = requestData;
    employeeData.probationDate = probationDate;
    employeeData.password = password;

    const dbResponse: EmployeeReturn = await employeeServices.create(employeeData);
    if (dbResponse.status === 'Error') {
        return res.status(400).json({
            message: dbResponse.message
        })
    }

    res.status(201).json({
        message: dbResponse.message,
        data: dbResponse.data
    })
}

const login = async (req: Request, res: Response) => {
    const requestData: EmployeeLogin = req.body;

    const dbResponse = await employeeServices.getEmployeeByEmail(requestData.email);
    if (dbResponse.status === 'Failed') {
        return res.status(404).json({
            message: 'Invalid email or password'
        });
    } else if (dbResponse.status === 'Error') {
        return res.status(400).json({
            error: dbResponse.message
        });
    }
    
    const employeePassword: string = dbResponse.data?.password as string;
    const passwordChecker: boolean = await hashingServices.verifyHash(
        requestData.password, employeePassword);
    if (!passwordChecker) {
        return res.status(400).json({
            message: 'Invalid email or password!'
        });
    }

    const employeeID: string = dbResponse.data?.id as string;
    const employeeEmail: string = dbResponse.data?.email as string;
    const tokenResponse = tokenServices.generateToken(employeeID, employeeEmail);
    if (tokenResponse.status === 'Success') {
        res.status(200).json({
            token: tokenResponse.token,
            data: dbResponse.data
        });
    console.log(dbResponse.data)

    }
    else {
        res.status(400).json({
            message: tokenResponse.message
        });
    }
}

const getAll = async (req: Request, res: Response) => {
    const dbResponse: EmployeeReturn = await employeeServices.getAll();

    if (dbResponse.status === 'Error') {
        return res.status(400).json({
            message: dbResponse.message
        })
    }

    res.status(200).json({
        data: dbResponse.data
    })
}

const getEmployeeByID = async (req: Request, res: Response) => {
    const ID: string = req.params.id;
    const dbResponse: EmployeeReturn = await employeeServices.getEmployeeByID(ID);

    if (dbResponse.status === 'Failed') {
        return res.status(404).json({
            message: dbResponse.message
        })
    } else if (dbResponse.status === 'Error') {
        return res.status(400).json({
            message: dbResponse.message
        })
    }

    res.status(200).json({
        data: dbResponse.data
    })
}

const del = async (req: Request, res: Response) => {
    const id: string = req.params.id;
    const dbResponse: EmployeeReturn = await employeeServices.del(id);

    if (dbResponse.status === 'Failed') {
        return res.status(404).json({
            message: dbResponse.message
        })
    } else if (dbResponse.status === 'Error') {
        return res.status(400).json({
            message: dbResponse.message
        })
    }

    res.status(200).json({
        message: dbResponse.message
    })
}

const update = async (req: Request, res: Response) => {
    const id: string = req.params.id;
    const updatedEmployee = req.body;
    const dbResponse: EmployeeReturn = await employeeServices.update(id, updatedEmployee);

    if (dbResponse.status === 'Failed') {
        return res.status(404).json({
            message: dbResponse.message
        })
    } else if (dbResponse.status === 'Error') {
        return res.status(400).json({
            message: dbResponse.message
        })
    }

    res.status(200).json({
        message: dbResponse.message,
        data: dbResponse.data
    });
}

const uploadImage = async (req: Request, res: Response) => {
    try {
        const employeeID: string = req.query.id as string;
        const uploadParams = {
            Bucket: 'vouch-crm',
            Key: req.file?.originalname || '',
            Body: req.file?.buffer || '',
        };

        const result = await s3.upload(uploadParams).promise();
        const employeeData = {
            image: result.Location
        }
        const dbResponse: EmployeeReturn = await employeeServices.update(employeeID, employeeData);
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

    } catch (error) {
        console.log(error)
        res.status(500)
    }
}

employeeRouter.post('/employee', checkIfAdmin, validationFunctions.createEmployeeBodyValidationRules(),
    validationFunctions.validationMiddleware, create);
employeeRouter.post('/employee-login', login);
employeeRouter.get('/employee', checkIfAdmin, getAll);
employeeRouter.get('/employee/:id', checkIfAdmin, getEmployeeByID);
employeeRouter.delete('/employee/:id', checkIfAdmin, del);
employeeRouter.put('/employee/:id', update);
employeeRouter.post('/employee-image', upload.single('file'), uploadImage);

export default employeeRouter;