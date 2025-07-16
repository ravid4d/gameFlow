import { Router } from 'express';
import {login,register} from '../controllers/Api/authController.js';
import userValidationRules from '../validators/userValidator.js';
import loginValidationRules from '../validators/loginValidator.js';

const router = Router();
router.post('/login',loginValidationRules,login);
router.post('/register',userValidationRules,register);

export default router;