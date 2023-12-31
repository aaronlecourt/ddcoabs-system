import connectMongo from '../../../../../utils/connectMongo';
import Appointment from '../../../../../models/Appointment';
import type { NextApiRequest, NextApiResponse } from 'next';
import APPOINTMENT_STATUS from "../../../../../constants/appointmentStatus";
import PAYMENT_METHOD from "../../../../../constants/paymentMethod";
import TIME_UNIT from "../../../../../constants/timeUnit";
import HTTP_CODES from "../../../../../constants/httpCodes";
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
      // dentist reschedule of appointment
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
          'startTime',
          'endTime',
        ];
        const requiredAppointmentFields = [
          'timeUnit',
          'price',
          'paymentMethod'
        ];

        // validation for required appointment confirmation fields
        requiredBookingReschedFields.map(v => {
          if (!body[v]) errorMessages.push(`${v} is required.`);

          if (!['date'].includes(v)) {
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
      
        // date validation
        if (body.date) {
          const currentDate = new Date().setHours(0,0,0,0)
          const appointmentDate = new Date(body.date).setHours(0,0,0,0)
          
          if (appointmentDate < currentDate)
            errorMessages.push('Date should not be earlier than today.')
        }
        
        // validate time unit
        if (!TIME_UNIT.includes(appointment.timeUnit)) {
          errorMessages.push(`Time should be in ${TIME_UNIT}`);
        }

        // validate start time
        if (body.startTime == 12)
          errorMessages.push('startTime should not be equal to 12 PM')

        if (body.startTime < 9)
          errorMessages.push('startTime should not be before 9:00 AM.');

        if (body.startTime >= body.endTime) {
          errorMessages.push('startTime should be less endTime.');
        }

        if (appointment.timeUnit === 'AM' && body.startTime > 11) {
          errorMessages.push('startTime should be less than 11.');
        }

        // validate end time
        if (body.endTime == 13)
          errorMessages.push('endTime should not be equal to 1 PM.');

        if (body.endTime > 18)
          errorMessages.push('endTime should not be later than 6:00 PM.');

        if (appointment.timeUnit === 'PM') {
          if (body.startTime < 13 ) {
            errorMessages.push('startTime should be 1 PM onwards');
          } 
          if (body.endTime < 14 ) {
            errorMessages.push('endTime should be later than 1 PM');
          }
        }

        // validate dentistService
        if (!body.dentistService) {
          if (!body.concern) errorMessages.push(`concern is required since no dentistService was selected.`);
        }

        if (body.dentistService && body.dentistService !== 'Consultation') {
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
        if (appointment.destistId) {
            const dentistScheduleConflict = await Appointment
            .find({
              _id: { $ne: id },
              dentistId: appointment.dentistId,
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
        }

        // check schedule conflicts for patient
        if (appointment.patientId) {
            const patientScheduleConflict = await Appointment
            .find({
              patientId: appointment.patientId,
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
        }

        if (errorMessages.length) {
            res.status(HTTP_CODES.expectationFailed).json(errorMessages);
            return;
        }

        // set default values
        // body.date = new Date(new Date(body.date).toUTCString()).toISOString()
        body.timeSlots = {};

        for (let i=body.startTime; i<body.endTime; i++) {
          body.timeSlots[i] = true;
        }
        body.status = APPOINTMENT_STATUS.rescheduled;
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