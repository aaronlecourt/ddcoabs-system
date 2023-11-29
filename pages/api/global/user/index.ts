import connectMongo from '../../../../utils/connectMongo';
import User from '../../../../models/User';

import type { NextApiRequest, NextApiResponse } from 'next'
import type { IUser } from '../../../interfaces/IUser'
import bcrypt from 'bcryptjs'

export default async function userHandler (
  req: NextApiRequest,
  res: NextApiResponse
) {

  try {    
    await connectMongo();
    
    const { query, method, body } = req  
  
    switch (method) {
      case 'GET':
        const users = await User.find();
        res.status(200).json(users);
        break;
      case 'POST':
        const user = new User(body);

        user.password = await bcrypt.hash(user.password, 10);
        
        const userCreated = await User.create(user);
        
        res.status(200).json(userCreated);
        break
      default:
        res.setHeader('Allow', ['GET', 'POST'])
        res.status(405).end(`Method ${method} Not Allowed`)
    }
  } catch (error) {
    console.log(error);
    res.json(error);
  }
}