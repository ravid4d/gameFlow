import { Router } from 'express';
import { showLogin,showRegister,login,register} from '../controllers/authController.js';
import WelcomeMail from '../mails/EmailVerificationMail.js';

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
router.get('/email/test',async (req,res) => {
    try {
    const user = {
      first_name: "ravi",
      email: "ravichaudhary.d4d@gmail.com",
    };

    const mail = new WelcomeMail(user);
    await mail.send();

    res.json({ success: true, message: 'Mail sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error });
  }
})

export default router;