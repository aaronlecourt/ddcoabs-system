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
      case 'PUT':
        let errorMessages: string[] = [];
        const requiredFields: string[] = [
          'newPassword',
          'confirmNewPassword'
        ];
        const passwordRegex = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/);

        // validation of required change password fields
        requiredFields.map(v => {
            if (!body[v])
                errorMessages.push(`${v} is required.`);
            
            if (body[v] && body[v].length < 8)
                errorMessages.push(`${v} should be at least 8 characters.`);
            
            if (body[v] && !passwordRegex.test(body[v]))
                errorMessages.push(`${v} should contain at least a capital letter, small letter, special characters and numbers.`);
        })
        
        // password validations
        const hashedConfirmNewPassword = await bcrypt.hash(body.confirmNewPassword, 10);

        if (body.newPassword !== body.confirmNewPassword) {
          errorMessages.push('newPassword should match confirmNewPassword.');
        }

        // return error if any of the validations failed
        if (errorMessages.length) {
          res.status(HTTP_CODES.expectationFailed).json(errorMessages);
          return;
        }
      
        // update user password
        const updatedUser = await User
        .findOneAndUpdate({ _id: id, role: ROLES.dentist }, { password: hashedConfirmNewPassword}, {
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