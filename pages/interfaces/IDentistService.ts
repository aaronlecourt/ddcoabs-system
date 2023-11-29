import { ObjectId } from 'mongodb';

export interface IDentistService {
    name: string,
    description?: string,
    dentistServiceTypeId: ObjectId,
    price: number
}