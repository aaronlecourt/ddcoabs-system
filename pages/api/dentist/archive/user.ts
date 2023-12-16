import connectMongo from '../../../../utils/connectMongo';
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
          const deletedService = await User.findByIdAndDelete(_id);
          if (!deletedService) {
            return res.status(404).json({ message: 'Service not found' });
          }
          return res.status(200).json({ message: 'Service deleted successfully', deletedService });
        } catch (error: any) {
          return res.status(500).json({ message: 'Failed to delete service', error: error.message });
        }
        break

      case 'PUT':
        try {
          const { _id } = body;
          if (!_id) {
            return res.status(400).json({ error: 'ID is required for update' });
          }
      
          const updatedService = await User.findByIdAndUpdate(
            _id,
            { isArchived: false },
            { new: true }
          );
      
          if (!updatedService) {
            return res.status(404).json({ message: 'Service not found' });
          }
      
          res.status(200).json({ message: 'Service updated successfully', updatedService });
        } catch (error: any) {
          res.status(500).json({ message: 'Failed to update service', error: error.message });
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