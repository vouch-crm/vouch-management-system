"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationFunctions = void 0;
const express_validator_1 = require("express-validator");
const createEmployeeBodyValidationRules = () => {
    return [
        (0, express_validator_1.body)('joinDate').exists().withMessage('JoinDate not provided').isDate()
            .withMessage('Invalid value for joinDate field'),
        (0, express_validator_1.body)('email').exists().withMessage('Email not provided').isEmail()
            .withMessage('Invalid value for email field')
    ];
};
const validationMiddleware = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        return next();
    }
    return res.status(400).json({ error: errors.array()[0].msg });
};
exports.validationFunctions = {
    createEmployeeBodyValidationRules,
    validationMiddleware
};
