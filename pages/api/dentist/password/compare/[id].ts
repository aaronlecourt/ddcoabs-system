import connectMongo from '../../../../../utils/connectMongo';
import User from '../../../../../models/User';
import ROLES from '../../../../../constants/roles'
import HTTP_CODES from '../../../../../constants/httpCodes'
import type { NextApiRequest, NextApiResponse } from 'next'
import type { IUser } from '../../../../interfaces/IUser'
import { ObjectId } from 'mongodb'
import bcrypt from 'bcryptjs'

export default async function userHandler (
  req: NextApiRequest,
  res: NextApiResponse
) {

  try {
    await connectMongo();
    
    const { query, method, body } = req;
    const id = new ObjectId(query.id as string);
    const user: IUser = await User.findOne({ _id: id, role: ROLES.dentist }).exec();

    if (!user) {
      res.status(HTTP_CODES.notFound).json('User not found');
      return;
    }

    switch (method) {
      // Update user password
      case 'POST':
        let errorMessages: string[] = [];
        const requiredFields: string[] = [
          'password'
        ];
        const passwordRegex = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/);

        // validation of required change password fields
        if (!body.password)
            errorMessages.push(`password is required.`);
        
        if (body.password && body.password.length < 8)
            errorMessages.push(`password should be at least 8 characters.`);
        
        if (body.password && !passwordRegex.test(body.password))
            errorMessages.push(`password should contain at least a capital letter, small letter, special characters and numbers.`);
    
        // password validation
        const oldPasswordMatch = await bcrypt.compare(body.password, user.password);
        if (!oldPasswordMatch) {
            errorMessages.push('password should match old password.');
        }

        // return error if any of the validations failed
        if (errorMessages.length) {
          res.status(HTTP_CODES.expectationFailed).json(errorMessages);
          return;
        }
        
        res.status(HTTP_CODES.success).json(user);
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