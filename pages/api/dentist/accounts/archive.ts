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
      case 'PUT':
        try {
          const { _id } = body;
      
          if (!_id) {
            return res.status(400).json({ error: 'ID is required for update' });
          }
      
          const updatedUser = await User.findOneAndUpdate(
            { _id },
            { $set: { isArchived: true } },
            { new: true }
          );
      
          if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
          }
      
          res.status(200).json(updatedUser);
        } catch (error) {
          console.error("Error updating user:", error);
          return res.status(500).json({ error: 'Error updating user' });
        }
        break;
      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT'])
        res.status(405).end(`Method ${method} Not Allowed`)
    }
  } catch (error) {
    console.log(error);
    res.json(error);
  }
}