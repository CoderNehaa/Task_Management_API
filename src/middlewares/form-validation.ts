import { Request, Response, NextFunction } from 'express';

const { body, validationResult } = require('express-validator');

export const validationMiddleware = async (req:Request, res:Response, next:NextFunction) => {
  const rules = [
    body('username').optional().notEmpty().withMessage('username cannot be empty')
      .custom((value:string) => {
        if (value.includes(' ')) {
          throw new Error('Username cannot contain spaces');
        }
        return true;
      }),
    body('password').isStrongPassword({
      minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1, minLength: 6,
    }).withMessage(
      'Passsword must contain one uppercase letter, one lowercase letter, one special character and one numeric digit.',
    ),
    body('password').isLength({ min: 6, max: 12 }).withMessage('Password contains minimum 6 and maximum 12 characters'),
  ];

  await Promise.all(rules.map((rule) => rule.run(req)));

  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    const errrorMesages = validationErrors.errors.map((obj:any) => obj.msg);
    return res.status(400).send({
      result: false,
      message: errrorMesages,
    });
  }

  next();
};