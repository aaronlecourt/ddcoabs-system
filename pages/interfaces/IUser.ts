export interface IUser {
    name: string,
    email: string,
    address: string,
    contactNumber: string,
    dateOfBirth: Date,
    age?: number,
    religion?: string,
    nationality?: string,
    bloodType?: string,
    sex: string,
    password: string,
    newPassword: string,
    confirmNewPassword: string,
    guardianName?: string,
    guardianContactNumber?: string,
    guardianIdFile?: string,     // for patient
    credentials?: string, // for dentist
    role: string
    isArchived: boolean
}