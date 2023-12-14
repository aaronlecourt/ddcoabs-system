import { ObjectId } from 'mongodb';

export interface IDentistService {
    name: string,
    description?: string,
    type: string,
    price: number,
    isArchived: boolean
}