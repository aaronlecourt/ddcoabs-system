import { IUser } from '../pages/interfaces/IUser';
import { Schema, model, models } from 'mongoose';

const schema = new Schema<IUser>({
    // id: ObjectId,
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        type: String,
        required: true,
    },
    mobile: {
        type: String,
        required: true
    },
    birthday: {
        type: Date,
        required: true,
    },
    age: Number,
    religion: String,
    nationality: String,
    bloodType: String,
    sex: {
        type: String,
        required: true,
        enum: ['M', 'F']
    },
    password: {
        type: String,
        required: true,
    },
    guardianName: String,
    guardianMobile: String,
    validID: String,
    isAdmin: {
        type: Boolean,
        default: false,
        required: true,
    },
})

const User = models.User || model<IUser>('User', schema);

export default User;