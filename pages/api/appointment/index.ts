import connectMongo from '../../../utils/connectMongo';
import Appointment from '../../../models/Appointment';

import type { NextApiRequest, NextApiResponse } from 'next'
import type { IAppointment } from '../../interfaces/IAppointment'

export default async function userHandler (
  req: NextApiRequest,
  res: NextApiResponse
) {

  try {
    await connectMongo();
    
    const { query, method, body } = req  
  
    switch (method) {
      case 'GET':
        const appointment = await Appointment.find();          
        res.status(200).json(appointment);
        break
      case 'POST':
        const appointmentCreated = await Appointment.insertMany(body);
        res.status(200).json(appointmentCreated);
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