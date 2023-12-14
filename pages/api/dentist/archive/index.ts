import connectMongo from '../../../../utils/connectMongo';
import DentistService from '../../../../models/DentistService';
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
        const dentistService = await DentistService.find({ isArchived: true });
        res.status(200).json(dentistService);
        break
      case 'DELETE':
        const { _id } = body;
        try {
          if (!_id) {
            return res.status(400).json({ error: 'ID is required for deletion' });
          }
          const deletedService = await DentistService.findByIdAndDelete(_id);
          if (!deletedService) {
            return res.status(404).json({ message: 'Service not found' });
          }
          return res.status(200).json({ message: 'Service deleted successfully', deletedService });
        } catch (error: any) {
          return res.status(500).json({ message: 'Failed to delete service', error: error.message });
        }
        break
      default:
        res.setHeader('Allow', ['GET', 'POST', 'DELETE'])
        res.status(405).end(`Method ${method} Not Allowed`)
    }
  } catch (error) {
    console.log(error);
    res.json(error);
  }
}