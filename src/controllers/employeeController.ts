import express, { Request, Response } from 'express';
import { employeeServices, EmployeeReturn } from '../services/employeeServices';
import { hashingServices } from '../services/hashingServices';
import { EmployeeDocument, EmployeeInput, EmployeeLogin, EmployeeAgent } from '../models/employeeModel';
import { validationFunctions } from '../middlewares/validation';
import { checkIfAdmin } from '../middlewares/adminMiddleware';
import { checkIfEmployeeHasHrDashboardAccess } from '../middlewares/employeeMiddleware';
import { tokenServices } from '../services/tokenServices';
import { s3 } from '../services/awsConfiguration';
import multer from "multer";
import { serviceStatuses } from '../services/enums';
import { S3Services } from '../services/s3Services';
import { emailServices } from '../services/emailService';

const upload = multer({});

const storage = multer.memoryStorage();
const uploadMulter = multer({ storage });

const employeeRouter = express.Router();

const create = async (req: Request, res: Response) => {
    const requestData: EmployeeInput = req.body;

    const probationDate = employeeServices.generateProbationDate(requestData.joinDate);
    const password = await hashingServices.hashPassword(
        employeeServices.passwordGenerator(requestData.email, requestData.password));

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
    const payload = {
        id: employeeID,
        email: employeeEmail
    }
    const tokenResponse = tokenServices.generateToken(payload);
    if (tokenResponse.status === 'Success') {
        res.status(200).json({
            token: tokenResponse.token,
            data: dbResponse.data
        });

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
        res.status(500)
    }
}

const uploadFile = async (req: Request, res: Response) => {
    if (!req.file) {
        return res.status(400).json({
            message: 'No file uploaded!'
        });
    }

    const ID = req.params.id;
    const { fileTitle } = req.query
    const empExist = await employeeServices.checkEmployeeExist(ID);
    if (!empExist) {
        return res.status(404).json({
            message: `No employee with ID: ${ID}`
        });
    }

    const fileContent = req.file.buffer;
    const contentType = req.file.mimetype;
    if (fileTitle === 'performance') {
        const fileName = `${ID}-Performance-Doc`;
        const s3Response = await S3Services.uploadFile(fileContent, fileName, contentType);
        if (s3Response.status !== serviceStatuses.SUCCESS) {
            return res.status(400).json({
                message: s3Response
            });
        }

        const performanceDocURL = s3Response.data as string;
        const employeeData = {
            performanceDocument: performanceDocURL,
            performanceLastUpdated: new Date()
        }
        const dbResponse2 = await employeeServices.update(ID, employeeData);
        if (dbResponse2.status !== serviceStatuses.SUCCESS) {
            return res.status(400).json({
                message: dbResponse2.message
            });
        }
        res.status(200).json({
            message: dbResponse2.message
        });
    } else {
        const fileName = `${ID}-${fileTitle}`;
        const s3Response = await S3Services.uploadFile(fileContent, fileName, contentType);
        if (s3Response.status !== serviceStatuses.SUCCESS) {
            return res.status(400).json({
                message: s3Response
            });
        }

        const document = {
            title: fileTitle,
            url: s3Response.data
        }

        const dbResponse2 = await EmployeeAgent.findByIdAndUpdate({ _id: ID }, {
            $push: { documents: document }
        })
        if (!dbResponse2) {
            return res.status(400).json({
                message: 'Error uploading the document'
            });
        }
        res.status(200).json({
            message: dbResponse2
        });
    }



}

const changePasswordRequest = async (req: Request, res: Response) => {
    const { email } = req.body;

    const dbResponse = await employeeServices.getEmployeeByEmail(email);

    if (dbResponse.status === serviceStatuses.FAILED) {
        return res.status(404).json({
            message: dbResponse.message
        });
    } else if (dbResponse.status === serviceStatuses.ERROR) {
        return res.status(400).json({
            message: dbResponse.message
        });
    }

    const payload = {
        email: email
    }
    const tokenResponse = tokenServices.generateToken(payload, '1m');

    if (tokenResponse.status !== serviceStatuses.SUCCESS) {
        return res.status(500).json({
            message: tokenResponse.message
        });
    }

    const token = tokenResponse.token;

    // once the frontend page for the change password is done, the body of the email will be
    // replaced with the link of the page/token
    const emailServiceResponse = await emailServices.sendEmail('development@vouch-os.com',
        email, 'test', `Employee token: ${token}`);

    if (emailServiceResponse.status !== serviceStatuses.SUCCESS) {
        return res.status(500).json({
            message: emailServiceResponse.message
        });
    }

    res.status(200).json({
        message: emailServiceResponse.message
    });
}

const changePassword = async (req: Request, res: Response) => {
    const { token, newPassword } = req.body;

    if (token === undefined || newPassword === undefined) {
        return res.status(400).json({
            message: 'Invalid request!'
        });
    }

    const tokenResponse = tokenServices.verifyToken(token);

    if (tokenResponse.status !== serviceStatuses.SUCCESS) {
        return res.status(400).json({
            message: tokenResponse.message
        });
    }

    const employeeEmail = tokenResponse.decoded?.email;
    const hashedPassword = await hashingServices.hashPassword(newPassword);

    const dbResponse = await employeeServices.updateByEmail(employeeEmail, hashedPassword);

    if (dbResponse.status === serviceStatuses.FAILED) {
        return res.status(404).json({
            message: dbResponse.message
        });
    } else if (dbResponse.status === serviceStatuses.ERROR) {
        return res.status(400).json({
            message: dbResponse.message
        });
    }

    res.status(200).json({
        message: dbResponse.message
    });
}

employeeRouter.post('/employee', checkIfEmployeeHasHrDashboardAccess,
    validationFunctions.createEmployeeBodyValidationRules(),
    validationFunctions.validationMiddleware, create);
employeeRouter.post('/employee-login', login);
employeeRouter.get('/employee', getAll);
employeeRouter.get('/employee/:id', checkIfEmployeeHasHrDashboardAccess, getEmployeeByID);
employeeRouter.delete('/employee/:id', checkIfEmployeeHasHrDashboardAccess, del);
employeeRouter.put('/employee/:id', update);
employeeRouter.post('/employee-change-password-request',
    validationFunctions.changePasswordRequestValidationRules(),
    validationFunctions.validationMiddleware, changePasswordRequest);
employeeRouter.put('/employee-change-password', changePassword);
employeeRouter.post('/employee-image', upload.single('file'), uploadImage);
employeeRouter.put('/employee-upload-performance/:id', uploadMulter.single('file'), uploadFile);

export default employeeRouter;