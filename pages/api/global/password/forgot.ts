import connectMongo from '../../../../utils/connectMongo';
import User from '../../../../models/User';
import PasswordResetToken from '../../../../models/PasswordResetToken';
import HTTP_CODES from '../../../../constants/httpCodes'
import type { NextApiRequest, NextApiResponse } from 'next'
import { IPasswordResetToken } from '../../../interfaces/IPasswordResetToken';
// const express = require('express');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const secret = process.env.NEXTAUTH_SECRET


function generateToken(userId: string) {
  return jwt.sign({ userId }, secret, { expiresIn: '1h' })
}

// Send password reset email
function sendPasswordResetEmail(email: string, token: string) {
  const transporter = nodemailer.createTransport({
    // Setup your email service configuration
    // Example using SMTP:
    service: 'yahoo',
    auth: {
      user: process.env.YAHOO_EMAIL,
      pass: process.env.YAHOO_EMAIL_APP_PW,
    },
    debug: true
  });

  const resetLink = `${process.env.NEXTAUTH_URL}/resetpassword?token=${token}`;

  const mailOptions = {
    from: process.env.YAHOO_EMAIL,
    to: email,
    subject: 'Password Reset',
    html: `Click <a href="${encodeURI(resetLink)}">here</a> to reset your password.`,
  };

  transporter.sendMail(mailOptions, (error: any, info: any) => {
    if (error) {
      console.error(error);
    } else {
      console.log('Email sent: ' + info.response);
      alert('Email sent: ' + info.response);
    }
  });
}

export default async function userHandler (
  req: NextApiRequest,
  res: NextApiResponse
) {

  try {
    await connectMongo();
    
    const { method, body } = req;
    let allPasswordResetTokens = await PasswordResetToken.find({}).exec() || [];
    allPasswordResetTokens = allPasswordResetTokens.map(v => v.token)

    switch (method) {
      case 'POST':
        let errorMessages: string[] = [];

        // validation of required change password fields
        if (!body.email)
          errorMessages.push(`email is required.`);

        // return error if any of the validations failed
        if (errorMessages.length) {
          res.status(HTTP_CODES.expectationFailed).json(errorMessages);
          return;
        }
        
        const user = await User.findOne({ email: body.email }).exec();

        if (!user || !user._id) {
          res.status(HTTP_CODES.notFound).json('User not found');
        }

        let resetToken = ''        
        do {
          // Generate and store reset token
          resetToken = generateToken(user._id);
        } while (allPasswordResetTokens.includes(resetToken))

        if (resetToken) {
          // Store the reset token in your database
          const passwordResetToken: IPasswordResetToken = new PasswordResetToken({
            userId: user._id,
            token: resetToken
          })
          
          const passwordResetTokenCreated = await PasswordResetToken.create(passwordResetToken);
          console.log('password reset token created ', passwordResetTokenCreated)

          // Send email with reset link
          sendPasswordResetEmail(body.email, resetToken);

          res.status(HTTP_CODES.success).json({ message: 'Password reset email sent. ' });          
        } {
          res.status(HTTP_CODES.internalServerError).json({ message: 'Something went wrong while generating token.'})
        }
        
        break;
        
      default:
        res.setHeader('Allow', ['POST'])
        res.status(405).end(`Method ${method} Not Allowed`)
    }
  } catch (error) {
    console.log(error);
    res.status(HTTP_CODES.internalServerError).send({ error: `Something went wrong. ${error}` });
  }
}