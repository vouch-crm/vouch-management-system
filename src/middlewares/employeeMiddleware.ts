import { employeeServices} from "../services/employeeServices";
import { tokenServices, tokenReturn } from "../services/tokenServices";
import { Request, Response, NextFunction } from 'express'

const extractEmployeeFromToken = async(token: string) => {
    const decodedToken: tokenReturn = tokenServices.verifyToken(token);
    if (decodedToken.status === 'Error') {
        return {
            status: 'Error',
            message: decodedToken.message,
            data: null
        }
    }

    const empID = decodedToken.decoded?.id as string;
    const employee = await employeeServices.getEmployeeByID(empID);
    if (employee.status === 'Failed') {
        return {
            status: 'Failed',
            message: employee.message,
            data: null
        }
    }

    return {
        status: 'Success',
        message: null,
        data: employee.data
    }
}

const checkIfEmployeeHasFinancesAcces = async(req: Request, res: Response, next: NextFunction) => {
    const authorizationToken: string | undefined = req.headers.authorization?.split(" ")[1];
    if (!authorizationToken) {
        return res.status(401).json({
            error: "Unauthorized"
        });
    }

    const employee = await extractEmployeeFromToken(authorizationToken);

    if (employee.status === 'Error') {
        return res.status(400).json({
            message: employee.message
        });
    }
    
    if (employee.status === 'Failed') {
        return res.status(404).json({
            message: employee.message
        });
    }

    const financeAccess = employee.data?.fullAccess.finances;
    if (financeAccess !== true) {
        return res.status(401).json({
            message: 'Unauthorized access!'
        });
    }

    next();
}

const checkIfEmployeeHasTimeTrackingAcces = async(req: Request, res: Response, next: NextFunction) => {
    const authorizationToken: string | undefined = req.headers.authorization?.split(" ")[1];
    if (!authorizationToken) {
        return res.status(401).json({
            error: "Unauthorized"
        });
    }

    const employee = await extractEmployeeFromToken(authorizationToken);

    if (employee.status === 'Error') {
        return res.status(400).json({
            message: employee.message
        });
    }
    
    if (employee.status === 'Failed') {
        return res.status(404).json({
            message: employee.message
        });
    }

    const financeAccess = employee.data?.fullAccess.timeTracker;
    if (financeAccess !== true) {
        return res.status(401).json({
            message: 'Unauthorized access!'
        });
    }

    next();
}

const checkIfEmployeeHasHrDashboardAcces = async(req: Request, res: Response, next: NextFunction) => {
    const authorizationToken: string | undefined = req.headers.authorization?.split(" ")[1];
    if (!authorizationToken) {
        return res.status(401).json({
            error: "Unauthorized"
        });
    }

    const employee = await extractEmployeeFromToken(authorizationToken);

    if (employee.status === 'Error') {
        return res.status(400).json({
            message: employee.message
        });
    }
    
    if (employee.status === 'Failed') {
        return res.status(404).json({
            message: employee.message
        });
    }

    const financeAccess = employee.data?.fullAccess.hrDashboard;
    if (financeAccess !== true) {
        return res.status(401).json({
            message: 'Unauthorized access!'
        });
    }

    next();
}

export {
    checkIfEmployeeHasFinancesAcces, 
    checkIfEmployeeHasHrDashboardAcces,
    checkIfEmployeeHasTimeTrackingAcces
}