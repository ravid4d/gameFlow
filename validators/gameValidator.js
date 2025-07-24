import { body } from 'express-validator';

export const createGameValidation = [
  body('title')
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 3 }).withMessage('Title must be at least 3 characters long'),

  body('game_amount')
    .notEmpty().withMessage('Game amount is required')
    .isNumeric().withMessage('Game amount must be a number')
    .custom((value) => value > 0).withMessage('Game amount must be greater than 0'),
];
