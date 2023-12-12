import connectMongo from '../../../../utils/connectMongo';
import Appointment from '../../../../models/Appointment';

import type { NextApiRequest, NextApiResponse } from 'next'
import { ObjectId } from "mongodb";

export default async function userHandler (
  req: NextApiRequest,
  res: NextApiResponse
) {

  try {
    await connectMongo();
    
    const { query, method, body } = req
    const id = new ObjectId(query.id as string);
  
    const appointment = await Appointment
      .findOne({ _id : id })

    switch (method) {
      case 'GET':
        const appointment = await Appointment
          .findOne({ _id :id })
          console.log('sarahhh ', appointment)
          res.status(200).json(appointment)
        break
      case 'PUT':
        const updatedAppointment = await Appointment
          .findOneAndUpdate({ _id: id }, body, {
            new: true,
            upsert: true, 
            setDefaultsOnInsert: true, 
            runValidators: true,
            context: 'query'
          }).exec()
        res.status(200).json(updatedAppointment)
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