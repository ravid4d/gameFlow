import { param, body } from 'express-validator';

export const joinGameValidation = [
  param('id')
    .notEmpty().withMessage('Game ID is required')
    .isInt().withMessage('Game ID must be a valid number'),
];