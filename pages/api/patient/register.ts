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
        const user: IUser = new User(body);
        let errorMessages: string[] = [];

        // validation of required registration fields
        if (!user.fullName) errorMessages.push('Full Name is required.');
        if (!user.email) errorMessages.push('Email Address is required.');
        if (!user.address) errorMessages.push('Address is required.');
        if (!user.mobile) errorMessages.push('Mobile Number is required.');
        if (!user.sex) errorMessages.push('Sex is required.');
        if (!user.password) errorMessages.push('Password is required.');
        if (!user.confirmPassword) errorMessages.push('Confirm Password is required.');

        // validation of duplicate email
        const emailDuplicate = await User.findOne({ email: user.email });
        if (emailDuplicate) errorMessages.push('Email address already exists');

        // validation of matching password and confirmPassword
        user.password = await bcrypt.hash(user.password, 10);
        user.confirmPassword = await bcrypt.hash(user.confirmPassword, 10);
        if (user.password !== user.confirmPassword) {
            errorMessages.push('Password and Confirm Password does not match');
        }
        
        // return error if any of the validations failed
        if (errorMessages.length) {
            res.status(HTTP_CODES.expectationFailed).json(errorMessages);
            return;
        }

        // assign user role
        user.role = ROLES.patient;

        // create user
        const userCreated = await User.create(user);
        
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