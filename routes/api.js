import { Router } from 'express';
import {login,register,verifyEmail} from '../controllers/Api/authController.js';
import userValidationRules from '../validators/userValidator.js';
import loginValidationRules from '../validators/loginValidator.js';
import { profileUpdate } from '../controllers/Api/profileController.js';
import authenticate from '../middleware/auth.js';
import updateUserValidationRules from '../validators/profileValidator.js';
import { listGames,createGame, joinGame } from '../controllers/Api/gameController.js';
import { createGameValidation } from '../validators/gameValidator.js';
import { joinGameValidation } from '../validators/joingameValidator.js';

const router = Router();
router.post('/login',loginValidationRules,login);
router.post('/register',userValidationRules,register);
router.put('/profile',authenticate,updateUserValidationRules,profileUpdate);
router.get('/verify/email',verifyEmail);

router.get('/games', authenticate, listGames);
router.post('/games', authenticate,createGameValidation, createGame); // Assuming you want to create a game here, adjust as necessary
router.post('/game/:id/join', authenticate,joinGameValidation, joinGame); // Adjust this route as necessary for joining a game

export default router;