import connectMongo from '../../../utils/connectMongo';
import Appointment from '../../../models/Appointment';
import type { NextApiRequest, NextApiResponse } from 'next'
import type { IAppointment } from '../../interfaces/IAppointment'
import APPOINTMENT_STATUS from "../../../constants/appointmentStatus";

export default async function userHandler (
  req: NextApiRequest,
  res: NextApiResponse
) {

  try {
    await connectMongo();

    const { query, method, body } = req  
  
    switch (method) {
      // for dentist role only
      case 'GET':
        const appointments = await Appointment.find();
        let datesBooked: any = {};
        let datesFullyBooked: any[] = [];

        appointments.map(v => {
            const timeSlots = Object.keys(v.timeSlots || {}) || []
            if (!datesBooked[v.date]) datesBooked[v.date] = timeSlots
            else if (Object.keys(v.timeSlots || {})) timeSlots.map(t => datesBooked[v.date].push(t))
        })

        Object.keys(datesBooked).map(v => {
            // times 9, 10, 11, 13, 14, 15, 16, 17
            if (datesBooked[v].length == 8) datesFullyBooked.push(v);
        })

        res.status(200).json(datesFullyBooked);
        break

      default:
          res.setHeader('Allow', ['GET'])
          res.status(405).end(`Method ${method} Not Allowed`)
    }
  } catch (error) {
    console.log(error);
    res.json(error);
  }
}