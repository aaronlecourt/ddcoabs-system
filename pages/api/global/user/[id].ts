import connectMongo from '../../../../utils/connectMongo';
import User from '../../../../models/User';

import type { NextApiRequest, NextApiResponse } from 'next'
import type { IUser } from '../../../interfaces/IUser'
import { ObjectId } from "mongodb";

export default async function userHandler (
  req: NextApiRequest,
  res: NextApiResponse
) {

  try {
    await connectMongo();
    
    const { query, method, body } = req
    const id = new ObjectId(query.id as string);
  
    const user = await User
      .findOne({ _id :id })

    switch (method) {
      case 'GET':
        const user = await User
          .findOne({ _id :id })
        res.status(200).json(user)
        break
      case 'PUT':
        const updatedUser = await User
          .findOneAndUpdate({ _id: id }, body, {
            new: true,
            upsert: true, 
            setDefaultsOnInsert: true, 
            runValidators: true,
            context: 'query'
          }).exec()
        res.status(200).json(updatedUser)
        break
      default:
        res.setHeader('Allow', ['GET', 'PUT'])
        res.status(405).end(`Method ${method} Not Allowed`)
    }
  } catch (error) {
    console.log(error);
    res.json(error);
  }
}