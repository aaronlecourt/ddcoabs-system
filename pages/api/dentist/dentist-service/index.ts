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
        const dentistService = await DentistService.find();
        res.status(200).json(dentistService);
        break
      case 'POST':
        const dentistServiceCreated = await DentistService.insertMany(body);
        res.status(200).json(dentistServiceCreated);
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