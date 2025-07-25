import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter=nodemailer.createTransport({
    host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: false, // true for 465, false for 587
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
});

export default transporter;