import connectMongo from '../../../utils/connectMongo';
import User from '../../../models/User';
import ROLES from '../../../constants/roles'
import HTTP_CODES from '../../../constants/httpCodes'
import type { NextApiRequest, NextApiResponse } from 'next'
import type { IUser } from '../../interfaces/IUser'
import bcrypt from 'bcryptjs'

export default async function userHandler (
  req: NextApiRequest,
  res: NextApiResponse
) {

  try {    
    await connectMongo();
    
    const { query, method, body } = req
  
    switch (method) {
      case 'POST':
        let errorMessages: string[] = [];
        const requiredRegistrationFields: string[] = [
          'fullName',
          'email',
          'address',
          'mobile',
          'birthday',
          'sex',
          'password',
          'confirmPassword'
        ];

        // validation of required registration fields
        requiredRegistrationFields.map(v => {
            if (!body[v]) errorMessages.push(`${v} is required.`);
        });
  
        // validation of duplicate email
        const emailDuplicate = await User.findOne({ email: body.email });
        if (emailDuplicate) errorMessages.push('Email address already exists');

        const hashedConfirmPassword = await bcrypt.hash(body.confirmPassword, 10);

        // validation of matching password and confirmPassword
        if (body.password !== body.confirmPassword) {
            errorMessages.push('password and confirmPassword does not match');
        }  
        
        // return error if any of the validations failed
        if (errorMessages.length) {
            res.status(HTTP_CODES.expectationFailed).json(errorMessages);
            return;
        }

        // assign default values
        body.role = ROLES.dentist;
        body.password = hashedConfirmPassword;

        // create user
        const userCreated: IUser = await User.create(body);
        
        res.status(HTTP_CODES.success).json(userCreated);
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