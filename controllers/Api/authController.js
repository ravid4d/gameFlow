import bcrypt from 'bcrypt' // spelling fix: "bcrypt" not "becrypt"
import User from '../../models/user.js'
import { validationResult } from 'express-validator'
import jwt from 'jsonwebtoken';
import WelcomeMail from '../../mails/EmailVerificationMail.js';

export const register = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      errors: errors.array({ onlyFirstError: true })
    })
  }

  const {
    first_name,
    last_name,
    email,
    password,
    phone_number,
    date_of_birth,
    device_id
  } = req.body

  try {
    const existingUser = await User.findOne({ where: { email } })
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email already exists'
      })
    }

    const existingPhone = await User.findOne({ where: { phone_number } })
    if (existingPhone) {
      return res.status(409).json({
        success: false,
        message: 'Phone number already exists'
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
      first_name,
      last_name,
      email,
      phone_number,
      date_of_birth,
      password: hashedPassword,
      device_id
    })

    // ✅ Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'your_jwt_secret' // Put this in .env
      //   { expiresIn: '1h' } // Valid for 1 hour
    )

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token: token, // ✅ Return the token
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone_number: user.phone_number,
        date_of_birth: user.date_of_birth
      }
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
}

export const login = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      errors: errors.array({ onlyFirstError: true })
    })
  }
  try {
    const { email, password } = req.body
    const user = await User.findOne({ where: { email } })

    if (!user) return res.render('login', { error: 'Invalid credentials' })

    const match = await bcrypt.compare(password, user.password)
    if (!match) return res.render('login', { error: 'Invalid credentials' })

    // Success
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'your_jwt_secret' // Put this in .env
      //   { expiresIn: '1h' } // Valid for 1 hour
    )
    return res.status(201).json({
      success: true,
      message: 'User login successfully',
      token: token, // ✅ Return the token
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone_number: user.phone_number,
        date_of_birth: user.date_of_birth
      }
    })
    // res.render('dashboard', { user })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
}

export const verifyEmail = async (req,res) => {
   try {
    const { email } = req.query;
    
    // ✅ Validation
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }

    // ✅ Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // ✅ Send OTP using nodemailer (you can customize this part)
    const mail = new WelcomeMail(otp,email);
    await mail.send();

    // ✅ Return success response
    return res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
      otp, // You might want to remove this in production
    });
  } catch (error) {
    console.error('Error sending OTP:', error.message);

    return res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
}
