import connectMongo from '../../../../utils/connectMongo';
import User from '../../../../models/User';
import type { NextApiRequest, NextApiResponse } from 'next'
import Appointment from '../../../../models/Appointment';

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
          const users = await User.find({ isArchived: true });

          res.status(200).json(users);
        } catch (error: any) {
          res.status(500).json({ message: 'Failed to fetch data', error: error.message });
        }
        break;
      case 'DELETE':
        const { _id } = body;
        try {
          if (!_id) {
            return res.status(400).json({ error: 'ID is required for deletion' });
          }
          const deletedAccount = await User.findByIdAndDelete(_id);
          if (!deletedAccount) {
            return res.status(404).json({ message: 'Account not found' });
          }

          await Appointment.deleteMany({ patientId: _id });
          return res.status(200).json({ message: 'Account deleted successfully', deletedAccount });
        } catch (error: any) {
          return res.status(500).json({ message: 'Failed to delete account', error: error.message });
        }
        break

      case 'PUT':
        try {
          const { _id } = body;
          if (!_id) {
            return res.status(400).json({ error: 'ID is required for update' });
          }
      
          const updatedAccount = await User.findByIdAndUpdate(
            _id,
            { isArchived: false },
            { new: true }
          );
      
          if (!updatedAccount) {
            return res.status(404).json({ message: 'Account not found' });
          }
      
          res.status(200).json({ message: 'Account updated successfully', updatedAccount });
        } catch (error: any) {
          res.status(500).json({ message: 'Failed to update account', error: error.message });
        }
        break;

      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
        res.status(405).end(`Method ${method} Not Allowed`)
    }
  } catch (error) {
    console.log(error);
    res.json(error);
  }
}