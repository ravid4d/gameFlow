import bcrypt from 'bcrypt'; // spelling fix: "bcrypt" not "becrypt"
import User from '../models/user.js';

export const showLogin = (req, res) => res.render('login');
export const showRegister = (req, res) => res.render('register');

export const register = async (req, res) => {
    const { first_name, last_name, email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (user) return res.render('register', { error: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ first_name, last_name, email, password: hashedPassword });

    res.redirect('/login');
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) return res.render('login', { error: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.render('login', { error: 'Invalid credentials' });

    // Success
    res.render('dashboard', { user });
};