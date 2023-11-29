import { Types } from "mongoose"
import { IAppointment } from '../pages/interfaces/IAppointment';
import { Schema, model, models } from 'mongoose';
import APPOINTMENT_STATUS from "../constants/appointmentStatus";

const schema = new Schema<IAppointment>({
    // id: ObjectId,
    dentist: {
        type: Types.ObjectId,
    },
    patient: {
        type: Types.ObjectId,
    },
    dentistService: {
        type: Types.ObjectId,
        required: true
    },
    concern: {
        type: String
    },
    status: {
        type: String,
        enum: APPOINTMENT_STATUS,
        required: true,
        default: 'Pending'
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    // derived from dentistservices by id
    price: {
        type: Number,
        required: true
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ['GCash', 'Pay in Cash']
    },
    // patient form
    details: {
        type: Object,
    },
}, {
    timestamps: true
})

const Appointment = models.Appointment || model<IAppointment>('Appointment', schema);

export default Appointment;