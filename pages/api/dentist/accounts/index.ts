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
            role: 'patient',
            $or: [
                { isArchived: false },
                { isArchived: null }
            ]
        });
        console.log(patientUsers);
        res.status(200).json(patientUsers);          
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