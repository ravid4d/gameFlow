import { Router } from 'express';
import {login,register} from '../controllers/Api/authController.js';
import userValidationRules from '../validators/userValidator.js';
import loginValidationRules from '../validators/loginValidator.js';
import { profileUpdate } from '../controllers/Api/profileController.js';
import authenticate from '../middleware/auth.js';
import updateUserValidationRules from '../validators/profileValidator.js';

const router = Router();
router.post('/login',loginValidationRules,login);
router.post('/register',userValidationRules,register);
router.put('/profile',authenticate,updateUserValidationRules,profileUpdate);

export default router;