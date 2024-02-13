import { body, validationResult } from 'express-validator'
import { Request, Response, NextFunction } from 'express'

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
        body('requestedDay').exists().withMessage('requestedDay not provided').isDate()
            .withMessage('Invalid value for requestedDay field'),
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
        body('startDate').exists().withMessage('startDate not provided').isDate()
            .withMessage('Invalid value for startDate'),
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
    createSalaryUpdateBodyValidationRules
}