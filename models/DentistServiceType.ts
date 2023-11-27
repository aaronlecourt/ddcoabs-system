import { Types } from "mongoose"
import { IDentistServiceType } from '../pages/interfaces/IDentistServiceType';
import { Schema, model, models } from 'mongoose';

const schema = new Schema<IDentistServiceType>({
    // id: ObjectId,
    name: {
        type: String,
        enum: ['Jacket Crowns','Removable Partial Denture'],
        required: true,
        unique: true
    }
}, {
    timestamps: true
})

const DentistServiceType = models.DentistServiceType || model<IDentistServiceType>('DentistServiceType', schema);

export default DentistServiceType;