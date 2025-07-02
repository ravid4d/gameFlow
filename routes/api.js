import { Router } from 'express';
import {login,register} from '../controllers/Api/authController.js';
import userValidationRules from '../validators/userValidator.js';

const router = Router();
router.post('/login',login);
router.post('/register',userValidationRules,register);

export default router;