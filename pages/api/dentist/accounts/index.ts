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
        const patientUsers = await User.find({
            isArchived: { $in: [false, null] }
        });
        // console.log(patientUsers);
        res.status(200).json(patientUsers);          
        break
    case 'PUT':
        const { _id, ...updateData } = body;
        console.log("Body Data Received:", body);
        console.log("UPDATED DATA: ", updateData)
        if (!_id) {
          res.status(400).json({ error: 'ID is required for update' });
          return;
        }

        updateData.isArchived = true; // Set isArchived to true

        try {
            const user = await User.findById(_id);
        
            if (!user) {
              res.status(404).json({ error: 'User not found' });
              return;
            }

            user.isArchived = true; // Update the field
            await user.save(); // Save the changes

            console.log("USER DATA: ", user)
        
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