import { ObjectId } from 'mongodb';

export interface IDentistService {
    name: string,
    dentistServiceType: ObjectId,
    price: number
}