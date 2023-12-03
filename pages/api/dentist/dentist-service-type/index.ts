import connectMongo from '../../../../utils/connectMongo';
import DentistServiceType from '../../../../models/DentistServiceType';

import type { NextApiRequest, NextApiResponse } from 'next'
import type { IDentistServiceType } from '../../../interfaces/IDentistServiceType'

export default async function userHandler (
  req: NextApiRequest,
  res: NextApiResponse
) {

  try {
    await connectMongo();
    
    const { query, method, body } = req  
  
    switch (method) {
      case 'GET':
        const dentistServiceType = await DentistServiceType.find();          
        res.status(200).json(dentistServiceType);
        break
      case 'POST':
        const dentistServiceTypeCreated = await DentistServiceType.insertMany(body);
        res.status(200).json(dentistServiceTypeCreated);
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