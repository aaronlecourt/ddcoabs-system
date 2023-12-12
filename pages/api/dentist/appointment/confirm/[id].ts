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
      // dentist confirmation of appointment
      case 'PUT':
        const id = new ObjectId(query.id as string);

        const appointment = await Appointment
          .findOne({ _id: id, status: APPOINTMENT_STATUS.pending })
          .exec();

        if (!appointment) {
          res.status(HTTP_CODES.notFound).json('Appointment not found.');
          return;
        }

        let errorMessages: string[] = [];

        const requiredBookingConfirmationFields = [
          'dentistId',
          'patientId',
          'startTime',
          'endTime',
        ];
        const requiredAppointmentFields = [
          'dentistService',
          'date',
          'timeUnit',
          'price',
          'paymentMethod'
        ];

        // validation for required appointment confirmation fields
        requiredBookingConfirmationFields.map(v => {
          if (!body[v]) errorMessages.push(`${v} is required.`);

          if (!['dentistId', 'patientId'].includes(v)) {
            if (body[v] && !Number.isInteger(body[v]))
            errorMessages.push(`${v} should be a valid integer.`);

          if (body[v] && Number.isInteger(body[v] && (body[v] < 0 || body[v] > 23)))
            errorMessages.push(`${v} should be between 0 and 23.`);
          }
        })

        // validation for required existing appointment fields
        requiredAppointmentFields.map(v => {
          if (!appointment[v]) errorMessages.push(`${v} is required.`);
        })
      
        // validate patient id
        const patient = await User
          .findOne({ _id: body.patientId, role: ROLES.patient })
          .exec();

        if (!patient) {
          errorMessages.push('patientId is invalid or not found.');
        }

        // validate dentist id
        const dentist = await User
          .findOne({ _id: body.dentistId, role: ROLES.dentist })
          .exec();

        if (!dentist) {
          errorMessages.push('dentistId is invalid or not found.');
        }

        // validate time unit
        if (!TIME_UNIT.includes(appointment.timeUnit)) {
          errorMessages.push(`Time should be in ${TIME_UNIT}`);
        }

        // validate start time
        if (body.startTime >= body.endTime) {
          errorMessages.push('startTime should be less endTime.');
        }

        if (appointment.timeUnit === 'AM' && body.startTime > 11) {
          errorMessages.push('startTime should be less than 11.');
        }

        // validate end time
        if (appointment.timeUnit === 'PM' && body.endTime < 12 ) {
          errorMessages.push('startTime should be more than 12.');
        }

        // validate dentistService
        if (body.dentistService) {
          const dentistService = await DentistService.findOne({ name: body.dentistService }).exec();
          if (!dentistService) {
            errorMessages.push(`dentistService is invalid or does not exist.`);
          }
        }
        
        // validate payment method
        if (!PAYMENT_METHOD.includes(appointment.paymentMethod)) {
            errorMessages.push(`Payment Method should in ${PAYMENT_METHOD}`);
        }
          
        // check schedule conflicts for dentist
        const dentistScheduleConflict = await Appointment
          .find({
            dentistId: body.dentistId,
            date: appointment.date,
            timeSlots: { $ne: null }
          })
          .exec();

        if (dentistScheduleConflict && dentistScheduleConflict.length) {
          dentistScheduleConflict.map(sched => {
            for (let i=body.startTime; i<body.endTime; i++) {
              if (sched.timeSlots[i]) {
                errorMessages.push(`Dentist time slot conflict with appointment id ${appointment._id} at ${i} ${appointment.timeUnit}`);
              }
            }
          });
        }

        // check schedule conflicts for patient
        const patientScheduleConflict = await Appointment
          .find({
            patientId: body.patientId,
            date: appointment.date,
            timeSlots: { $ne: null }
          })
          .exec();

        if (patientScheduleConflict && patientScheduleConflict.length) {
          patientScheduleConflict.map(sched => {
            for (let i=body.startTime; i<body.endTime; i++) {
              if (sched.timeSlots[i]) {
                // TO DO: notify patient about schedule conflict
                // errorMessages.push(`Patient time slot conflict with appointment id ${appointment._id} at ${i} ${appointment.timeUnit}`);
              }
            }
          });
        }

        if (errorMessages.length) {
            res.status(HTTP_CODES.expectationFailed).json(errorMessages);
            return;
        }

        // set default values
        body.status = APPOINTMENT_STATUS.confirmed;
        body.timeSlots = {};

        for (let i=body.startTime; i<body.endTime; i++) {
          body.timeSlots[i] = true;
        }

        const appointmentConfirmed = await Appointment
          .findOneAndUpdate({ _id: id }, body, {
            new: true,
            upsert: true, 
            setDefaultsOnInsert: true, 
            runValidators: true,
            context: 'query'
          }).exec()
        res.status(HTTP_CODES.success).json(appointmentConfirmed);
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