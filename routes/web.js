import { Router } from 'express';
import { showLogin,showRegister,login,register} from '../controllers/authController.js';

const router = Router();
router.get('/',(req,res)=> {
    res.render('home.ejs');
});
router.get('/login',showLogin);
router.get('/register',showRegister);
router.post('/login',login);
router.post('/register',register);
router.get('/dashboard',(req,res)=>{
    res.render('dashboard');
});
router.get('/chat',(req,res) => {
    res.render('chat');
});

export default router;