export interface IUser {
    fullName: string,
    email: string,
    address: string,
    mobile: string,
    birthday: Date,
    age?: number,
    religion?: string,
    nationality?: string,
    bloodType?: string,
    sex: string,
    password: string,
    guardianName?: string,
    guardianMobile?: string,
    validID?: string,
    role: string
}