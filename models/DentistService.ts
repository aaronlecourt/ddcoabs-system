import { Types } from "mongoose"
import { IDentistService } from '../pages/interfaces/IDentistService';
import { Schema, model, models } from 'mongoose';

const schema = new Schema<IDentistService>({
    // id: ObjectId,
    name: {
        type: String,
        required: true,
        unique: true
    },
    dentistServiceType: {
        type: Types.ObjectId,
        required: true,
    },
    price: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
})

const DentistService = models.DentistService || model<IDentistService>('DentistService', schema);

export default DentistService;