import connectMongo from '../../../utils/connectMongo';
import User from '../../../models/User';
import ROLES from '../../../constants/roles'
import HTTP_CODES from '../../../constants/httpCodes'
import type { NextApiRequest, NextApiResponse } from 'next'
import type { IUser } from '../../interfaces/IUser'
import { validateRegistrationRequest } from '../../../lib/backendvalidations/registration'
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
        // validate registration request
        const isRequestValid = await validateRegistrationRequest(body);
        if (!isRequestValid.isValid) {
            res.status(HTTP_CODES.expectationFailed).json(isRequestValid.errorMessages);
            return;
        }

        // assign default role
        body.role = ROLES.patient;

        // assign hashed password
        const hashedConfirmPassword = await bcrypt.hash(body.confirmPassword, 10);
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