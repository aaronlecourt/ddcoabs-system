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
    newPassword: string,
    confirmPassword: string,
    guardianName?: string,
    guardianMobile?: string,
    validID?: string,     // for patient
    credentials?: string, // for dentist
    role: string
}