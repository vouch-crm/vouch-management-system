import express, {Request, Response} from 'express'
import { employeeServices, EmployeeReturn } from '../services/employeeServices';
import { adminRoles, serviceStatuses } from '../services/enums';
import { checkIfSuperadmin } from '../middlewares/adminMiddleware';

const adminRouter = express.Router();

const create = async (req: Request, res: Response) => {
    const ID = req.body.id;
    const adminData = {
        role: adminRoles.ADMIN
    }
    const dbResponse: EmployeeReturn = await employeeServices.update(ID, adminData);
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
        message: dbResponse.message,
        data: dbResponse.data
    });
}

const del = async (req: Request, res: Response) => {
    const ID = req.params.id;
    const adminData = {
        role: null
    }
    const dbResponse: EmployeeReturn = await employeeServices.update(ID, adminData);
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
        message: dbResponse.message,
        data: dbResponse.data
    });
}

adminRouter.post('/admin', checkIfSuperadmin, create);
adminRouter.delete('/admin/:id', checkIfSuperadmin, del);
export default adminRouter;