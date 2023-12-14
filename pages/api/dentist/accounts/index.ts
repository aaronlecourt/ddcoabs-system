import connectMongo from '../../../../utils/connectMongo';
import Users from '../../../../models/User';
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
        const patientUsers = await Users.find({
            isArchived: { $in: [false, null] }
        });
        // console.log(patientUsers);
        res.status(200).json(patientUsers);          
        break
    case 'PUT':
        const { _id, ...updateData } = body;
        if (!_id) {
          res.status(400).json({ error: 'ID is required for update' });
          return;
        }

        updateData.isArchived = true; // Set isArchived to true

        try {
            const user = await Users.findByIdAndUpdate(_id, updateData, {
              new: true,
            });
        
            if (!user) {
              res.status(404).json({ error: 'User not found' });
              return;
            }
        
            res.status(200).json(user);
          } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
          }
        break
      default:
        res.setHeader('Allow', ['GET', 'POST'])
        res.status(405).end(`Method ${method} Not Allowed`)
    }
  } catch (error) {
    console.log(error);
    res.json(error);
  }
}