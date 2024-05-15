import { body, validationResult } from 'express-validator'
import { Request, Response, NextFunction } from 'express'
import { revenueType } from '../services/enums'

const createEmployeeBodyValidationRules = () => {
    return [
        body('joinDate').exists().withMessage('JoinDate not provided'),
        body('email').exists().withMessage('Email not provided').isEmail()
            .withMessage('Invalid value for email field'),
        body('firstName').exists().withMessage('First-name not provided'),
        body('lastName').exists().withMessage('Last-name not provided'),
        body('title').exists().withMessage('Title not provided')
    ]
}

const createEmployeeRequestBodyValidationRules = () => {
    return [
        body('requestedDay').exists().withMessage('requestedDay not provided'),
        body('type').exists().withMessage('type not provided'),
        body('empID').exists().withMessage('empID not provided'),
    ]
}

const createSalaryUpdateBodyValidationRules = () => {
    return [
        body('empID').exists().withMessage('empID not provided'),
        body('amount').exists().withMessage('amount not provided').isNumeric()
            .withMessage('Invalid value for amount field'),
        body('basis').exists().withMessage('basis not provided'),
        body('payFrequency').exists().withMessage('payFrequency not provided'),
        body('startDate').exists().withMessage('startDate not provided')
    ]
}

const createTrainingBodyValidationRules = () => {
    return [
        body('empID').exists().withMessage('empID not provided'),
        body('trainingTitle').exists().withMessage('trainingTitle not provided'),
        body('trainingType').exists().withMessage('trainingType not provided')
    ]
}

const createRevenueBodyValidationRules = () => {
    return [
        body('type').custom(value => {
            if (value !== revenueType.CONFIRMED && value !== revenueType.AWAITING_APPROVAL &&
                value !== revenueType.OPPORTUNITY && value !== revenueType.NEW_LEADS) {
                throw new Error('Invalid value for type field');
            }
            return true;
        }),
        body('year').exists().withMessage('year field not provided'),
        body('months').exists().withMessage('months field not provided')
    ]
}

const updateRevenueCellBodyValidations = () => {
    return [
        body('monthName').custom(value => {
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
        body('updatedCell').exists().withMessage('updatedCell field not provided'),
    ]
}

const validationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next()
    }

    const extractedErrors: any = []
    errors.array().map(err => extractedErrors.push({ 'error': err.msg }))
    return res.status(400).json({ errors: extractedErrors });
}

export const validationFunctions = {
    createEmployeeBodyValidationRules,
    validationMiddleware,
    createEmployeeRequestBodyValidationRules,
    createSalaryUpdateBodyValidationRules,
    createTrainingBodyValidationRules,
    createRevenueBodyValidationRules,
    updateRevenueCellBodyValidations
}