"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkIfAdmin = void 0;
const adminServices_1 = require("../services/adminServices");
const tokenServices_1 = require("../services/tokenServices");
const checkIfAdmin = async (req, res, next) => {
    const authorizationToken = req.headers.authorization?.split(" ")[1];
    if (!authorizationToken) {
        return res.status(401).json({
            error: "Unauthorized"
        });
    }
    const decodedToken = tokenServices_1.tokenServices.verifyToken(authorizationToken);
    if (decodedToken.status === 'Error') {
        return res.status(400).json({
            message: decodedToken.message
        });
    }
    const adminID = decodedToken.decoded?.id;
    const dbResponse = await adminServices_1.adminServices.findByID(adminID);
    if (dbResponse.status === 'Failed') {
        return res.status(404).json({
            message: dbResponse.message
        });
    }
    next();
};
exports.checkIfAdmin = checkIfAdmin;
