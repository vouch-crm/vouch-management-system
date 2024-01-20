import express, {Request, Response} from 'express'
import { adminServices, AdminReturn } from '../services/adminServices';
import { AdminInput } from '../models/adminModel';
import { hashingServices } from '../services/hashingServices';
import { tokenServices } from '../services/tokenServices';

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

adminRouter.post('/admin', login);
export default adminRouter;