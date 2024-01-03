import { Types } from "mongoose"
import { IAppointment } from '../pages/interfaces/IAppointment';
import { Schema, model, models } from 'mongoose';
import APPOINTMENT_STATUS from "../constants/appointmentStatus";
import PAYMENT_METHOD from "../constants/paymentMethod";

const schema = new Schema<IAppointment>({
    // id: ObjectId,
    dentistId: {
        type: Types.ObjectId,
    },
    patientId: {
        type: Types.ObjectId,
    },
    patientName: {
        type: String,
    },
    dentistService: {
        type: String,
    },
    contactNumber: {
        type: String,
    },
    concern: {
        type: String
    },
    status: {
        type: String,
        enum: Object.values(APPOINTMENT_STATUS),
        required: true,
        default: 'Pending'
    },
    date: {
        type: Date,
        required: true
    },
    timeUnit: {
        type: String,
        required: true
    },
    startTime: {
        type: Number,
    },
    endTime: {
        type: Number,
    },
    timeSlots: {
        type: Object,
    },
    // derived from dentistservices by id
    price: {
        type: Number,
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: PAYMENT_METHOD
    },
    // patient form
    details: {
        type: Object,
    },
    isArchived: {
        type: Boolean,
        default: false,
    },
    cancelReason: {
        type: String
    },
    isWalkIn: {
        type: Boolean,
        default: false,
    },
    
}, {
    timestamps: true
})

const Appointment = models.Appointment || model<IAppointment>('Appointment', schema);

export default Appointment;