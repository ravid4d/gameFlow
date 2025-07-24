// mails/WelcomeMail.js
import transporter from '../config/mailer.js';
import dotenv from 'dotenv';
dotenv.config();

class VerificationMail {
  constructor(otp,email) {
    this.otp = otp;
    this.email = email;
  }

  async send() {
    const mailOptions = {
      from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_ADDRESS}>`,
      to: this.email,
      subject: 'Email Verification OTP',
      html: `
        <h1>Hello Dear,</h1>
        <p>Your otp for verification is <strong>${this.otp}</strong></p>
      `,
    };

    await transporter.sendMail(mailOptions);
  }
}

export default VerificationMail;
