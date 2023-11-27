import { ObjectId } from 'mongodb';

export interface IAppointment {
    dentist?: ObjectId,
    patient?: ObjectId,
    dentistService: ObjectId,
    concern: string,
    status: string,
    date: Date,
    time: string,
    price: number,
    paymentMethod: string,
    details?: object // patient form
}