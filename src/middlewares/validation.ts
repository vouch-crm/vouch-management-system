import {body, validationResult} from 'express-validator'
import {Request, Response, NextFunction} from 'express'

const createEmployeeBodyValidationRules = () => {
    return [
        body('joinDate').exists().withMessage('JoinDate not provided').isDate()
            .withMessage('Invalid value for joinDate field'),
        body('email').exists().withMessage('Email not provided').isEmail()
            .withMessage('Invalid value for email field'),
        body('firstName').exists().withMessage('First-name not provided'),
        body('lastName').exists().withMessage('Last-name not provided'),
        body('title').exists().withMessage('Title not provided')
    ]
  }

const validationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next()
      }
    
    const extractedErrors: any = []
    errors.array().map(err => extractedErrors.push({'error': err.msg}))
    return res.status(400).json({errors: extractedErrors});
}

export const validationFunctions = {
    createEmployeeBodyValidationRules,
    validationMiddleware
}