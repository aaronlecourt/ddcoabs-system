import { ObjectId } from 'mongodb';

export interface IAppointment {
    dentistId?: ObjectId,
    patientId?: ObjectId,
    dentistServiceId: ObjectId,
    concern: string,
    status: string,
    date: Date,
    timeUnit: string,
    startTime?: number,
    endTime?: number,
    timeSlots: object,
    price: number,
    paymentMethod: string,
    details?: object // patient form
}