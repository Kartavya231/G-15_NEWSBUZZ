// const nodemailer = require('nodemailer');
// const { google } = require('googleapis');

import nodemailer from 'nodemailer';
import { google } from 'googleapis';

import dotenv from 'dotenv';
dotenv.config();
// require('dotenv').config();

async function sendEmail(username, email, code, CheckUserExist) {


  console.log("sendEmail function called");
  const CLIENT_ID = process.env.CLIENT_ID;
  const CLIENT_SECRET = process.env.CLIENT_SECRET;
  const REDIRECT_URI = process.env.REDIRECT_URI;
  const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

  // console.log(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, REFRESH_TOKEN);

  const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

  oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });



  try {
    const accessToken = await oAuth2Client.getAccessToken();
    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'parthivva227@gmail.com',
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });

    // const mailOptions = {
    //   from: 'News Aggregator <parthivva227@gmail.com>',
    //   to: `${email}`,
    //   subject: 'Test Email using Gmail API',
    //   text: 'This is a test email sent using Gmail API',
    //   html: '<h1>This is a test email sent using Gmail API</h1>',
    // };

    let mailOptions;

    if (CheckUserExist) {
      mailOptions = {
        from: 'NewsBuzz parthivva227@gmail.com>',
        to: `${email}`,
        subject: 'Forget Password Verification Code',
        html: `<p>Dear User,</p>
             <p>We received a request to reset the password for your account on NewsBuzz. To proceed, please use the verification code below:</p>
             <h2>Verification Code: ${code}</h2>
             <p>If you did not request a password reset, please ignore this email. Your password will remain unchanged.</p>
             <p>Thank you for using NewsBuzz!</p>
             <p>Best regards,<br>The NewsBuzz Team</p>`,
      };
    }
    else {
      mailOptions = {
        from: 'NewsBuzz <parthivva227@gmail.com>',
        to: `${email}`,  // Replace with the user's email address
        subject: 'Welcome to NewsBuzz - Email Verification',
        html: `
        <p>Dear ${username},</p>
        <p>Welcome to NewsBuzz! We're excited to have you on board.</p>
        <p>To verify your email address and activate your account, please use the verification code below:</p>
        <h2>Verification Code: ${code}</h2>
        <p>If you did not sign up for NewsBuzz, please ignore this email.</p>
        <p>Thank you for joining NewsBuzz!</p>
        <p>Best regards,<br>The NewsBuzz Team</p>`,
      };
    }

    const result = await transport.sendMail(mailOptions);
    return result;

  }
  catch (err) {
    return err;
  }
}

// module.exports = sendEmail;

export default sendEmail;
