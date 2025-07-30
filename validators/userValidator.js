import { body } from 'express-validator'
import User from '../models/user.js' // adjust path if needed

const userValidationRules = [
  body('first_name').notEmpty().withMessage('First name is required'),

  body('date_of_birth')
    .notEmpty()
    .withMessage('Date of birth is required')
    .isDate()
    .withMessage('Date of birth must be a valid date'),

  body('phone_number')
    .notEmpty()
    .withMessage('Phone number is required')
    .isString()
    .withMessage('Phone number must be a string')
    .custom(async value => {
      const existingUser = await User.findOne({
        where: { phone_number: value }
      })
      if (existingUser) {
        throw new Error('Phone number already in use')
      }
      return true
    }),

  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Email must be valid')
    .custom(async value => {
      const existingUser = await User.findOne({ where: { email: value } })
      if (existingUser) {
        throw new Error('Email already in use')
      }
      return true
    }),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),

  body('confirm_password')
    .notEmpty().withMessage('Confirm password is required')
    .custom((value, { req }) => value === req.body.password)
    .withMessage('Passwords do not match'),
];

export default userValidationRules
