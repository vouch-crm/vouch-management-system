import express, {Request, Response} from 'express'
import { adminServices, IRetrunAdmin } from '../services/adminServices';
import { hashingServices } from '../services/hashingServices';
import { tokenServices } from '../services/tokenServices';

const adminRouter = express.Router();

const login = async (req: Request, res:Response) => {
    const requestData = req.body;

    const dbResponse: IRetrunAdmin = await adminServices.findByEmail(requestData.email);
    if (dbResponse.status === 'Failed') {
        return res.status(404).json({
            message: 'Invalid email or password'
        });
    } else if (dbResponse.status === 'Error') {
        return res.status(400).json({
            error: dbResponse.message
        });
    }

    const passwordChecker: boolean = await hashingServices.verifyHash(
        requestData.password, dbResponse.data.password);
    if (!passwordChecker) {
        res.status(400).json({
            message: 'Invalid email or password!'
        });
    }

    const tokenResponse = await tokenServices.generateToken(dbResponse.data.id, dbResponse.data.email);
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