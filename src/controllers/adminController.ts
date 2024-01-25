import express, {Request, Response} from 'express'
import { adminServices, AdminReturn } from '../services/adminServices';
import { AdminDocument, AdminInput } from '../models/adminModel';
import { hashingServices } from '../services/hashingServices';
import { tokenServices } from '../services/tokenServices';
import { serviceStatuses } from '../services/enums';
import { checkIfSuperadmin } from '../middlewares/adminMiddleware';

const adminRouter = express.Router();

const login = async (req: Request, res:Response) => {
    const requestData: AdminInput = req.body;

    const dbResponse = await adminServices.findByEmail(requestData.email);
    if (dbResponse.status === 'Failed') {
        return res.status(404).json({
            message: 'Invalid email or password'
        });
    } else if (dbResponse.status === 'Error') {
        return res.status(400).json({
            error: dbResponse.message
        });
    }
    
    const adminPassword: string = dbResponse.data?.password as string;
    const passwordChecker: boolean = await hashingServices.verifyHash(
        requestData.password, adminPassword);
    if (!passwordChecker) {
        res.status(400).json({
            message: 'Invalid email or password!'
        });
    }

    const adminID: string = dbResponse.data?.id as string;
    const adminEmail: string = dbResponse.data?.email as string;
    const tokenResponse = await tokenServices.generateToken(adminID, adminEmail);
    if (tokenResponse.status === 'Success') {
        res.status(200).json({
            token: tokenResponse.token
        });
    }
    else {
        res.status(400).json({
            message: tokenResponse.message
        });
    }
}

const create = async (req: Request, res: Response) => {
    const requestData: AdminDocument = req.body
    const hashedPassword: string = await hashingServices.hashPassword(requestData.password);
    requestData.password = hashedPassword;
    const dbResponse: AdminReturn = await adminServices.create(requestData);
    if (dbResponse.status !== serviceStatuses.SUCCESS) {
        return res.status(400).json({
            error: dbResponse.message
        });
    }

    res.status(201).json({
        message: dbResponse.message,
        data: dbResponse.data
    });
}

const del = async (req: Request, res: Response) => {
    const ID: string = req.params.id;
    const dbResponse: AdminReturn = await adminServices.del(ID);
    if (dbResponse.status === serviceStatuses.FAILED) {
        return res.status(404).json({
            message: dbResponse.message
        });
    } else if (dbResponse.status === serviceStatuses.ERROR) {
        return res.status(400).json({
            error: dbResponse.message
        });
    }

    res.status(200).json({
        message: 'Admin deleted successfuly!'
    });
}

adminRouter.post('/admin-login', login);
adminRouter.post('/admin', checkIfSuperadmin, create);
adminRouter.delete('/admin/:id', checkIfSuperadmin, del);
export default adminRouter;