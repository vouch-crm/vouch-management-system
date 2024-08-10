import { employeeServices, EmployeeReturn } from "../services/employeeServices";
import { tokenServices, tokenReturn } from "../services/tokenServices";
import { Request, Response, NextFunction } from 'express'

const checkIfEmployeeHasFinanceAccess = async(req: Request, res: Response, next: NextFunction) => {
    const authorizationToken: string | undefined = req.headers.authorization?.split(" ")[1];
    if (!authorizationToken) {
        return res.status(401).json({
            error: "Unauthorized"
        });
    }

    const decodedToken: tokenReturn = tokenServices.verifyToken(authorizationToken);
    if (decodedToken.status === 'Error') {
        return res.status(400).json({
            message: decodedToken.message
        });
    }

    const empID = decodedToken.decoded?.id as string;
    const employee = await employeeServices.getEmployeeByID(empID);
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

export {checkIfEmployeeHasFinanceAccess}