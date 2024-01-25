import { adminServices, AdminReturn } from "../services/adminServices";
import { adminRoles } from "../services/enums";
import { tokenServices, tokenReturn } from "../services/tokenServices";
import { Request, Response, NextFunction } from 'express'

const checkIfAdmin = async (req: Request, res: Response, next: NextFunction) => {
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

    const adminID: string = decodedToken.decoded?.id as string;
    const dbResponse: AdminReturn = await adminServices.findByID(adminID);
    if (dbResponse.status === 'Failed') {
        return res.status(404).json({
            message: dbResponse.message
        });
    }

    next();
}

const checkIfSuperadmin = async (req: Request, res: Response, next: NextFunction) => {
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

    const adminID: string = decodedToken.decoded?.id as string;
    const dbResponse: AdminReturn = await adminServices.findByID(adminID);
    if (dbResponse.status === 'Failed') {
        return res.status(404).json({
            message: dbResponse.message
        });
    }

    const role: string = dbResponse.data?.role 
    if (role !== adminRoles.SUPERADMIN) {
        return res.status(401).json({
            error: 'Unauthorized admin access'
        });
    }

    next();
}

export { checkIfAdmin, checkIfSuperadmin }