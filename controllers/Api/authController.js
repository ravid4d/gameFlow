import bcrypt from 'bcrypt' // spelling fix: "bcrypt" not "becrypt"
import User from '../../models/user.js'
import { validationResult } from 'express-validator'
import jwt from 'jsonwebtoken'

export const register = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const formattedErrors = {}

    errors.array({ onlyFirstError: true }).forEach(err => {
      formattedErrors[err.param] = err.msg
    })

    return res.status(422).json({
      success: false,
      errors: formattedErrors
    })
  }

  const {
    first_name,
    last_name,
    email,
    password,
    phone_number,
    date_of_birth
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
      password: hashedPassword
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
  const { email, password } = req.body
  const user = await User.findOne({ where: { email } })

  if (!user) return res.render('login', { error: 'Invalid credentials' })

  const match = await bcrypt.compare(password, user.password)
  if (!match) return res.render('login', { error: 'Invalid credentials' })

  // Success
  res.render('dashboard', { user })
}
