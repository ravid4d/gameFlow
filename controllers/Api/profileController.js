import { validationResult } from 'express-validator'
import User from '../../models/user.js'

export const profileUpdate = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      const message = errors.array().map(err => err.msg).join(', ');

    return res.status(422).json({
      success: false,
      message: message,
      data: []
    });
    }
    const userId = req.user.id // ✅ ID from JWT payload

    const user = await User.findByPk(userId)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        data: []
      })
    }

    await user.update({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      phone_number: req.body.phone_number,
      date_of_birth: req.body.date_of_birth,
    });

    return res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: user
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error',
      data: []
    })
  }
}
