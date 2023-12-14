import connectMongo from '../../../../utils/connectMongo';
import Appointments from '../../../../models/Appointment';
import User from '../../../../models/User';
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function userHandler (
  req: NextApiRequest,
  res: NextApiResponse
) {

  try {
    await connectMongo();
    
    const { query, method, body } = req  
  
    switch (method) {
      case 'GET':
        try {
            // Fetch appointments that meet certain criteria (e.g., is not archived)
            const appointments = await Appointments.find({
              $or: [{ isArchived: false }, { isArchived: null }],
            }).lean();
  
            // Extract unique userIds from the fetched appointments
            const userIds = Array.from(new Set(appointments.map(appointment => appointment.userId)));
  
            // Fetch user data based on the extracted userIds
            const users = await User.find({ _id: { $in: userIds } }).lean();
  
            // Combine appointments with their respective users
            const combinedData = appointments.map(appointment => {
              const user = users.find(user => user.id.toString() === appointment.userId.toString());
              return { ...appointment, user };
            });
  
            console.log('Combined Data:', combinedData);
  
            res.status(200).json(combinedData);
          } catch (error) {
            console.error('Error fetching or combining data:', error);
            res.status(500).json({ error: 'Internal server error' });
          }
        break;
    //   case 'POST':
    //     const dentistServiceCreated = await DentistService.insertMany(body);
    //     res.status(200).json(dentistServiceCreated);
    //     break
    //   case 'PUT':
    //     const { _id, ...updateData } = body; // Assuming 'id' is provided in the update request
    //     if (!_id) {
    //       res.status(400).json({ error: 'ID is required for update' });
    //       return;
    //     }
    //     const service = await DentistService.findByIdAndUpdate(_id, updateData, {
    //       new: true,
    //     });
    //     res.status(200).json(service);
    //     break
      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT'])
        res.status(405).end(`Method ${method} Not Allowed`)
    }
  } catch (error) {
    console.log(error);
    res.json(error);
  }
}