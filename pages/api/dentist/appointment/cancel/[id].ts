import connectMongo from '../../../../../utils/connectMongo';
import Appointment from '../../../../../models/Appointment';
import User from '../../../../../models/User';
import type { NextApiRequest, NextApiResponse } from 'next'
import type { IAppointment } from '../../../../interfaces/IAppointment'
import APPOINTMENT_STATUS from "../../../../../constants/appointmentStatus";
import PAYMENT_METHOD from "../../../../../constants/paymentMethod";
import TIME_UNIT from "../../../../../constants/timeUnit";
import HTTP_CODES from "../../../../../constants/httpCodes";
import ROLES from "../../../../../constants/roles";
import DentistService from '../../../../../models/DentistService';
import { ObjectId } from 'mongodb'

const secret = process.env.NEXTAUTH_SECRET

export default async function userHandler (
  req: NextApiRequest,
  res: NextApiResponse
) {

  try {
    await connectMongo();

    const { query, method, body } = req  
  
    switch (method) {
      // dentist cancel of appointment
      case 'PUT':
        const id = new ObjectId(query.id as string);

        const appointment = await Appointment
          .findOne({ _id: id })
          .exec();

        if (!appointment) {
          res.status(HTTP_CODES.notFound).json('Appointment not found.');
          return;
        }

        Object.assign(body, { status: APPOINTMENT_STATUS.canceled })

        const appointmentCanceled = await Appointment
          .findOneAndUpdate({ _id: id }, body, {
            new: true,
            upsert: true, 
            setDefaultsOnInsert: true, 
            runValidators: true,
            context: 'query'
          }).exec()
        res.status(HTTP_CODES.success).json(appointmentCanceled);

        break
      default:
          res.setHeader('Allow', ['PUT'])
          res.status(HTTP_CODES.methodNotAllowed).end(`Method ${method} Not Allowed`)
    }
  } catch (error) {
    console.log(error);
    res.status(HTTP_CODES.internalServerError).send({ error: `Something went wrong. ${error}` });
  }
}