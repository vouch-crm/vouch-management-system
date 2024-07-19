"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationFunctions = void 0;
const express_validator_1 = require("express-validator");
const enums_1 = require("../services/enums");
const createEmployeeBodyValidationRules = () => {
    return [
        (0, express_validator_1.body)('joinDate').exists().withMessage('JoinDate not provided'),
        (0, express_validator_1.body)('email').exists().withMessage('Email not provided').isEmail()
            .withMessage('Invalid value for email field'),
        (0, express_validator_1.body)('firstName').exists().withMessage('First-name not provided'),
        (0, express_validator_1.body)('lastName').exists().withMessage('Last-name not provided'),
        (0, express_validator_1.body)('title').exists().withMessage('Title not provided')
    ];
};
const createEmployeeRequestBodyValidationRules = () => {
    return [
        (0, express_validator_1.body)('requestedDay').exists().withMessage('requestedDay not provided'),
        (0, express_validator_1.body)('type').exists().withMessage('type not provided'),
        (0, express_validator_1.body)('empID').exists().withMessage('empID not provided'),
    ];
};
const createSalaryUpdateBodyValidationRules = () => {
    return [
        (0, express_validator_1.body)('empID').exists().withMessage('empID not provided'),
        (0, express_validator_1.body)('amount').exists().withMessage('amount not provided').isNumeric()
            .withMessage('Invalid value for amount field'),
        (0, express_validator_1.body)('basis').exists().withMessage('basis not provided'),
        (0, express_validator_1.body)('payFrequency').exists().withMessage('payFrequency not provided'),
        (0, express_validator_1.body)('startDate').exists().withMessage('startDate not provided')
    ];
};
const createTrainingBodyValidationRules = () => {
    return [
        (0, express_validator_1.body)('empID').exists().withMessage('empID not provided'),
        (0, express_validator_1.body)('trainingTitle').exists().withMessage('trainingTitle not provided'),
        (0, express_validator_1.body)('trainingType').exists().withMessage('trainingType not provided')
    ];
};
const createRevenueBodyValidationRules = () => {
    return [
        (0, express_validator_1.body)('type').custom(value => {
            if (value !== enums_1.revenueType.CONFIRMED && value !== enums_1.revenueType.AWAITING_APPROVAL &&
                value !== enums_1.revenueType.OPPORTUNITY && value !== enums_1.revenueType.NEW_LEADS) {
                throw new Error('Invalid value for type field');
            }
            return true;
        }),
        (0, express_validator_1.body)('year').exists().withMessage('year field not provided'),
        (0, express_validator_1.body)('months').exists().withMessage('months field not provided')
    ];
};
const updateRevenueCellBodyValidations = () => {
    return [
        (0, express_validator_1.body)('monthName').custom(value => {
            switch (value) {
                case 'Jan':
                    break;
                case 'Feb':
                    break;
                case 'Mar':
                    break;
                case 'Apr':
                    break;
                case 'May':
                    break;
                case 'Jun':
                    break;
                case 'Jul':
                    break;
                case 'Aug':
                    break;
                case 'Sep':
                    break;
                case 'Oct':
                    break;
                case 'Nov':
                    break;
                case 'Dec':
                    break;
                default:
                    throw new Error('Invalid month name!');
            }
            return true;
        }),
        (0, express_validator_1.body)('updatedCell').exists().withMessage('updatedCell field not provided'),
    ];
};
const updateConvertedRevenueCellBodyValidations = () => {
    return [
        (0, express_validator_1.body)('monthName').custom(value => {
            switch (value) {
                case 'Jan':
                    break;
                case 'Feb':
                    break;
                case 'Mar':
                    break;
                case 'Apr':
                    break;
                case 'May':
                    break;
                case 'Jun':
                    break;
                case 'Jul':
                    break;
                case 'Aug':
                    break;
                case 'Sep':
                    break;
                case 'Oct':
                    break;
                case 'Nov':
                    break;
                case 'Dec':
                    break;
                default:
                    throw new Error('Invalid month name!');
            }
            return true;
        }),
        (0, express_validator_1.body)('type').custom(value => {
            switch (value) {
                case enums_1.revenueType.CONFIRMED:
                    break;
                case enums_1.revenueType.AWAITING_APPROVAL:
                    break;
                case enums_1.revenueType.NEW_LEADS:
                    break;
                case enums_1.revenueType.OPPORTUNITY:
                    break;
                default:
                    throw new Error('Invalid type field value!');
            }
            return true;
        }),
        (0, express_validator_1.body)('year').exists().withMessage('year field not provided'),
        (0, express_validator_1.body)('updatedValues').exists().withMessage('updatedValues field not provided'),
        (0, express_validator_1.body)('clientID').exists().withMessage('clientID field not provided'),
    ];
};
const createProjectBodyValidationRules = () => {
    return [
        (0, express_validator_1.body)('clientID').exists().withMessage('clientID not provided'),
        (0, express_validator_1.body)('name').exists().withMessage('name not provided'),
        (0, express_validator_1.body)('budget').exists().withMessage('budget not provided')
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
    validationMiddleware,
    createEmployeeRequestBodyValidationRules,
    createSalaryUpdateBodyValidationRules,
    createTrainingBodyValidationRules,
    createRevenueBodyValidationRules,
    updateRevenueCellBodyValidations,
    updateConvertedRevenueCellBodyValidations,
    createProjectBodyValidationRules
};
