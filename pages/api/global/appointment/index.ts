import connectMongo from '../../../../utils/connectMongo';
import Appointment from '../../../../models/Appointment';
import type { NextApiRequest, NextApiResponse } from 'next'
import type { IAppointment } from '../../../interfaces/IAppointment'
import APPOINTMENT_STATUS from "../../../../constants/appointmentStatus";
import { getToken } from "next-auth/jwt"

const secret = process.env.NEXTAUTH_SECRET

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
        let mongoDbQuery = {};

        if (query) {
          Object.keys(query).map(v => {
            if (v == 'status' && !Object.values(APPOINTMENT_STATUS).find(a => a == query.status)) {
              res.status(417).json(`status should be in ${Object.values(APPOINTMENT_STATUS)}`);
            }

            if (v == 'dentistService') {
              Object.assign(mongoDbQuery, { [v]: { '$regex': `${query[v]}`, '$options': 'i' }})
            } else {
              Object.assign(mongoDbQuery, { [v]: query[v] })
            }
          })
        }

        const appointment = await Appointment.find(mongoDbQuery);
        res.status(200).json(appointment);
        break;

      // for patient role only.   
      case 'POST':
        // validate req body
        if (!['AM', 'PM'].includes(body.time)) {
          res.status(417).json('Time should be AM or PM only');
        }

        const appointmentCreated = await Appointment.create(body);
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