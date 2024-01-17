import {body, validationResult} from 'express-validator'
import {Request, Response, NextFunction} from 'express'

const createEmployeeBodyValidationRules = () => {
    return [
        body('joinDate').exists().withMessage('JoinDate not provided').isDate()
            .withMessage('Invalid value for joinDate field'),
        body('email').exists().withMessage('Email not provided').isEmail()
            .withMessage('Invalid value for email field')
    ]
  }

const validationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next()
      }
    
    return res.status(400).json({error: errors.array()[0].msg});
}

export const validationFunctions = {
    createEmployeeBodyValidationRules,
    validationMiddleware
}