import connectMongo from '../../../../utils/connectMongo';
import Appointment from '../../../../models/Appointment';
import type { NextApiRequest, NextApiResponse } from 'next'
import type { IAppointment } from '../../../interfaces/IAppointment'
import APPOINTMENT_STATUS from "../../../../constants/appointmentStatus";
import PAYMENT_METHOD from "../../../../constants/paymentMethod";
import TIME_UNIT from "../../../../constants/timeUnit";
import HTTP_CODES from "../../../../constants/httpCodes";
import DentistService from '../../../../models/DentistService';

const secret = process.env.NEXTAUTH_SECRET

export default async function userHandler (
  req: NextApiRequest,
  res: NextApiResponse
) {

  try {
    await connectMongo();

    const { query, method, body } = req  
  
    switch (method) {
      // for booking of appointment without patientId, status is pending
      case 'POST':
        let errorMessages: string[] = []

        const validBookingFields = [
            'dentistId',
            'date',
            'timeUnit',
            'paymentMethod',
            'patientName'
        ];

        validBookingFields.map(v => {
            if (!body[v]) errorMessages.push(`${v} is required.`);
        })

        // date validation
        if (body.date) {
          const currentDate = new Date().setHours(0,0,0,0)
          const appointmentDate = new Date(body.date).setHours(0,0,0,0)
          
          if (appointmentDate < currentDate)
            errorMessages.push('Date should not be earlier than today.')
        }
        
        // validate time unit
        if (!TIME_UNIT.includes(body.timeUnit)) {
          errorMessages.push(`Time should be in ${TIME_UNIT}`);
        }

        // validate dentistService and concern
        if (!body.dentistService) {
          if (!body.concern) errorMessages.push(`concern is required since no dentistService was selected.`);
        }

        if (body.dentistService && body.dentistService != 'Consultation') {
          const dentistService = await DentistService.findOne({ name: body.dentistService }).exec();
          if (!dentistService) {
            errorMessages.push(`dentist Service is invalid or does not exist.`);
          }
        }

        // validate payment method
        if (!PAYMENT_METHOD.includes(body.paymentMethod)) {
            errorMessages.push(`Payment Method should in ${PAYMENT_METHOD}`);
        }
          
        if (errorMessages.length) {
            res.status(HTTP_CODES.expectationFailed).json(errorMessages);
            return;
        }

        const patientName = body.patientName || 'Default Patient Name';

        // set default values
        body.details = body.details || {} // patient form
        body.concern = body.concern || ""
        body.status = APPOINTMENT_STATUS.pending;
        body.isWalkIn = true;

        console.log('Body with patientName:', body);
        console.log('Extracted Patient Name:', patientName);

        const appointmentData = new Appointment({
          ...body,
          patientName: patientName,
        });

        // const appointmentCreated: IAppointment = await Appointment.create(appointmentData);
        const appointmentCreated: IAppointment = await appointmentData.save();
        res.status(200).json(appointmentCreated);
        break
      default:
          res.setHeader('Allow', ['POST'])
          res.status(405).end(`Method ${method} Not Allowed`)
    }
  } catch (error) {
    console.log(error);
    res.status(HTTP_CODES.internalServerError).send({ error: `Something went wrong. ${error}` });
  }
}