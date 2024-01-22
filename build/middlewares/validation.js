"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationFunctions = void 0;
const express_validator_1 = require("express-validator");
const createEmployeeBodyValidationRules = () => {
    return [
        (0, express_validator_1.body)('joinDate').exists().withMessage('JoinDate not provided').isDate()
            .withMessage('Invalid value for joinDate field'),
        (0, express_validator_1.body)('email').exists().withMessage('Email not provided').isEmail()
            .withMessage('Invalid value for email field'),
        (0, express_validator_1.body)('firstName').exists().withMessage('First-name not provided'),
        (0, express_validator_1.body)('lastName').exists().withMessage('Last-name not provided'),
        (0, express_validator_1.body)('title').exists().withMessage('Title not provided')
    ];
};
const validationMiddleware = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        return next();
    }
    const extractedErrors = [];
    errors.array().map(err => extractedErrors.push({ 'error': err.msg }));
    return res.status(400).json({ errors: extractedErrors });
};
exports.validationFunctions = {
    createEmployeeBodyValidationRules,
    validationMiddleware
};
