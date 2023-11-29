import connectMongo from '../../../../utils/connectMongo';
import User from '../../../../models/User';
import ROLES from '../../../../constants/roles'
import HTTP_CODES from '../../../../constants/httpCodes'
import type { NextApiRequest, NextApiResponse } from 'next'
import type { IUser } from '../../../interfaces/IUser'
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
    const user: IUser = await User.findOne({ _id: id, role: ROLES.patient }).exec();

    if (!user) {
      res.status(HTTP_CODES.expectationFailed).json('User not found');
    }

    switch (method) {
      // Update user password
      case 'PUT':
        let errorMessages: string[] = [];
        const requiredFields: string[] = ['password', 'newPassword', 'confirmPassword'];
        const passwordRegex = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 'g');

        // validation of required change password fields
        requiredFields.map(v => {
          if (!body[v]) errorMessages.push(`${v} is required.`);
        })
        
        // password validations
        const hashedConfirmPassword = await bcrypt.hash(body.confirmPassword, 10);

        if (body.confirmPassword.length < 8 || body.newPassword.length < 8) {
          errorMessages.push('newPassword and confirmPassword should be at least 8 characters.');
        }

        if (!passwordRegex.test(body.confirmPassword)) {
          errorMessages.push('password should contain at least a capital letter, small letter, special characters and numbers.');
        }

        const oldPasswordMatch = await bcrypt.compare(body.password, user.password);
        if (!oldPasswordMatch) {
            errorMessages.push('password should match old password.');
        }

        if (body.newPassword !== body.confirmPassword) {
          errorMessages.push('newPassword should match confirmPassword.');
        }

        // return error if any of the validations failed
        if (errorMessages.length) {
          res.status(HTTP_CODES.expectationFailed).json(errorMessages);
          return;
        }
      
        // update user password
        const updatedUser = await User
        .findOneAndUpdate({ _id: id, role: ROLES.patient }, { password: hashedConfirmPassword}, {
          new: true,
          upsert: true, 
          setDefaultsOnInsert: true, 
          runValidators: true,
          context: 'query'
        }).exec()
        
        res.status(HTTP_CODES.success).json(updatedUser);
        break;
        
      default:
        res.setHeader('Allow', ['PUT'])
        res.status(405).end(`Method ${method} Not Allowed`)
    }
  } catch (error) {
    console.log(error);
    res.status(HTTP_CODES.internalServerError).send({ error: `Something went wrong. ${error}` });
  }
}