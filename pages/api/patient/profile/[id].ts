import connectMongo from '../../../../utils/connectMongo';
import User from '../../../../models/User';
import ROLES from '../../../../constants/roles'
import HTTP_CODES from '../../../../constants/httpCodes'
import type { NextApiRequest, NextApiResponse } from 'next'
import type { IUser } from '../../../interfaces/IUser'
import { ObjectId } from 'mongodb'

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
      res.status(HTTP_CODES.notFound).json('User not found');
      return;
    }

    switch (method) {
      // Get user profile by id
      case 'GET':
        res.status(HTTP_CODES.success).json(user);
        break;

      // Update user profile
      case 'PUT':
        let errorMessages: string[] = [];
        const requiredRegistrationFields: string[] = [
          'firstName',
          'lastName',
          'email',
          'address',
          'contactNumber',
          'sex'
        ];
        const requiredProfileFields: string[] = [
          'age',
          'religion',
          'nationality',
          'bloodType'
        ];

        // validation of required registration fields
        requiredRegistrationFields.map(v => {
          if (!body[v]) errorMessages.push(`${v} is required.`);
        });

        // validation of required profile update fields
        requiredProfileFields.map(v => {
          if (!body[v]) errorMessages.push(`${v} is required.`);
        });

        // dateOfBirth validation
        if (body.dateOfBirth) {
          const currentDate = new Date().setHours(0,0,0,0)
          const birthDate = new Date(body.dateOfBirth).setHours(0,0,0,0)
          
          if (birthDate >= currentDate)
              errorMessages.push('dateOfBirth should not be before current date.')
        }

        // validation of required fields for minors
        if (body.age && body.age < 18) {
          if (!body.guardianName) errorMessages.push('guardianName is required.');
          if (!body.guardianContactNumber) errorMessages.push('guardianMobile is required.');
        }

        // validation of duplicate email
        const emailDuplicate = await User.findOne({ '_id': {$ne: id}, email: body.email });
        if (emailDuplicate) errorMessages.push('email already exists');
        
        // return error if any of the validations failed
        if (errorMessages.length) {
            res.status(HTTP_CODES.expectationFailed).json(errorMessages);
            return;
        }

        // update user profile
        const updatedUser = await User
        .findOneAndUpdate({ _id: id, role: ROLES.patient }, body, {
          new: true,
          upsert: true, 
          setDefaultsOnInsert: true, 
          runValidators: true,
          context: 'query'
        }).exec()
        
        res.status(HTTP_CODES.success).json(updatedUser);
        break;
        
      default:
        res.setHeader('Allow', ['GET','PUT'])
        res.status(405).end(`Method ${method} Not Allowed`)
    }
  } catch (error) {
    console.log(error);
    res.status(HTTP_CODES.internalServerError).send({ error: `Something went wrong. ${error}` });
  }
}