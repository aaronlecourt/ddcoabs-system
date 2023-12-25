import { IUser } from '../pages/interfaces/IUser';
import { Schema, model, models } from 'mongoose';
import ROLES from '../constants/roles'

const schema = new Schema<IUser>({
    // id: ObjectId,
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
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
    contactNumber: {
        type: String,
        required: true
    },
    dateOfBirth: {
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
        minLength: 8
    },
    guardianName: {
        type: String,
    },
    guardianContactNumber: {
        type: String,
    },
    guardianIdFile: {
        type: String,
    },
    credentials: {
        type: String,
    },
    role: {
        type: String,
        required: true,
        enum: [ROLES.dentist, ROLES.patient, ROLES.employee]
    },
    isArchived: {
        type: Boolean,
        default: false,
    }
}, {
    timestamps: true
})

const User = models.User || model<IUser>('User', schema);

// Create collection of Model 
User.createCollection().then(function (collection) { 
    console.log('User Collection is created!'); 
});

export default User;