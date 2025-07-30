import { body } from 'express-validator';
import User from '../models/user.js';

export const updateUserValidationRules = [
  body('first_name').notEmpty().withMessage('First name is required'),
  // body('last_name').notEmpty().withMessage('Last name is required'),
  body('email')
    .isEmail().withMessage('Invalid email')
    .custom(async (value, { req }) => {
      const existingUser = await User.findOne({ where: { email: value } });
      if (existingUser && existingUser.id !== req.user.id) {
        throw new Error('Email already in use');
      }
      return true;
    }),
  body('phone_number')
    .notEmpty().withMessage('Phone number is required')
    .isMobilePhone().withMessage('Invalid phone number'),
  body('date_of_birth')
    .notEmpty().withMessage('Date of birth is required')
    .isDate().withMessage('Invalid date format (YYYY-MM-DD)'),
];

export default updateUserValidationRules;