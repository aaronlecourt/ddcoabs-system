import connectMongo from '../../../../../utils/connectMongo';
import User from '../../../../../models/User';
import ROLES from '../../../../../constants/roles'
import HTTP_CODES from '../../../../../constants/httpCodes'
import type { NextApiRequest, NextApiResponse } from 'next'
import type { IUser } from '../../../../interfaces/IUser'
import { ObjectId } from 'mongodb'
import bcrypt from 'bcryptjs'
import { IPasswordResetToken } from '../../../../interfaces/IPasswordResetToken';
import PasswordResetToken from '../../../../../models/PasswordResetToken';

export default async function userHandler (
  req: NextApiRequest,
  res: NextApiResponse
) {

  try {
    await connectMongo();
    
    const { query, method, body } = req;
    const token = query.token;
    const passwordResetToken = await PasswordResetToken.findOne({ token: `${token}` }).exec();

    if (!passwordResetToken) {
      res.status(HTTP_CODES.notFound).json({ verified: false, message: 'Password Reset Token invalid or expired.' });
    }

    switch (method) {
      case 'GET':
        // check expiry, default expiry is 1 hr
        if (passwordResetToken.token) {
          const currentDate: any = new Date()
          const tokenCreatedDate: any = new Date(passwordResetToken.createdAt)
          
          // difference in minutes between token created datetime and current date and time
          const diff = (Math.abs(currentDate - tokenCreatedDate))/1000/60;

          // difference should only be within 1 hr
          if (diff > 60) {
            // res.status(HTTP_CODES.badRequest).json({ verified: false, message: 'Token is already expired or invalid. ' + diff + ' ' + currentDate + ' ' + tokenCreatedDate + " " + token})
            res.status(HTTP_CODES.badRequest).json({ verified: false, message: 'Token is already expired or invalid.'})
          }
        }

        res.status(HTTP_CODES.success).json({ verified: true, message: passwordResetToken});
        break;

      default:
        res.setHeader('Allow', ['GET'])
        res.status(405).end(`Method ${method} Not Allowed`)
    }
  } catch (error) {
    console.log(error);
    res.status(HTTP_CODES.internalServerError).send({ error: `Something went wrong. ${error}` });
  }
}