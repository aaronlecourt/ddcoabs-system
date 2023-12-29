import { Types } from "mongoose"
import { Schema, model, models } from 'mongoose';
import { IPasswordResetToken } from '../pages/interfaces/IPasswordResetToken';


const schema = new Schema<IPasswordResetToken>({
    // id: ObjectId,
    userId: {
        type: Types.ObjectId,
        required: true
    },
    token: {
        type: String,
        required: true
    },
}, {
    timestamps: true
})

const PasswordResetToken = models.PasswordResetToken || model<IPasswordResetToken>('PasswordResetToken', schema);

export default PasswordResetToken;