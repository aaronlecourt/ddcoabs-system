import connectMongo from '../../../../../utils/connectMongo';
import Appointment from '../../../../../models/Appointment';
import type { NextApiRequest, NextApiResponse } from 'next';
import APPOINTMENT_STATUS from '../../../../../constants/appointmentStatus';
import HTTP_CODES from '../../../../../constants/httpCodes';
import { ObjectId } from 'mongodb';

export default async function updateAppointmentStatus(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await connectMongo();

    const { query, method } = req;

    if (method === 'PUT') {
      const id = new ObjectId(query.id as string);

      const appointment = await Appointment.findOne({ _id: id }).exec();

      if (!appointment) {
        res.status(HTTP_CODES.notFound).json('Appointment not found.');
        return;
      }

      // Update the status to 'confirmed'
      appointment.status = APPOINTMENT_STATUS.confirmed;

      // Save the updated appointment status
      const updatedAppointment = await appointment.save();

      res.status(HTTP_CODES.success).json(updatedAppointment);
    } else {
      res.setHeader('Allow', ['PUT']);
      res.status(HTTP_CODES.methodNotAllowed).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error(error);
    res.status(HTTP_CODES.internalServerError).send({ error: `Something went wrong. ${error}` });
  }
}
