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
      // patient reschedule of appointment, status to pending
      case 'PUT':
        const id = new ObjectId(query.id as string);

        const appointment = await Appointment
          .findOne({ _id: id })
          .exec();

        if (!appointment) {
          res.status(HTTP_CODES.notFound).json('Appointment not found.');
          return;
        }

        let errorMessages: string[] = [];

        const requiredBookingReschedFields = [
          'date',
          'timeUnit'
        ];
        const requiredAppointmentFields = [
          'dentistServiceId',
          'timeUnit',
          'price',
          'paymentMethod'
        ];

        // validation for required appointment confirmation fields
        requiredBookingReschedFields.map(v => {
          if (!body[v]) errorMessages.push(`${v} is required.`);
        })

        // validation for required existing appointment fields
        requiredAppointmentFields.map(v => {
          if (!appointment[v]) errorMessages.push(`${v} is required.`);
        })
      
        // validate time unit
        if (!TIME_UNIT.includes(body.timeUnit)) {
          errorMessages.push(`Time should be in ${TIME_UNIT}`);
        }

        // validate dentistService
        const dentistService = await DentistService
          .findOne({ _id: appointment.dentistServiceId})
          .exec();

        if (!dentistService) {
          errorMessages.push(`dentistServiceId is invalid or does not exist.`);
        }

        // validate payment method
        if (!PAYMENT_METHOD.includes(appointment.paymentMethod)) {
            errorMessages.push(`Payment Method should in ${PAYMENT_METHOD}`);
        }
          
        if (errorMessages.length) {
            res.status(HTTP_CODES.expectationFailed).json(errorMessages);
            return;
        }

        // set default values
        body.status = APPOINTMENT_STATUS.pending;
        body.date = new Date(new Date(body.date).toUTCString()).toISOString();
        body.timeSlots = {};
        body.startTime = null;
        body.endTime = null;

        const appointmentResched = await Appointment
          .findOneAndUpdate({ _id: id }, body, {
            new: true,
            upsert: true, 
            setDefaultsOnInsert: true, 
            runValidators: true,
            context: 'query'
          }).exec()
        res.status(HTTP_CODES.success).json(appointmentResched);

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