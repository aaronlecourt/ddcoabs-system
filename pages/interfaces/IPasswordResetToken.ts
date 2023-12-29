import { ObjectId } from 'mongodb';

export interface IPasswordResetToken {
    userId: ObjectId,
    token: string
}