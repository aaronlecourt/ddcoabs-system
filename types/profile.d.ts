import { ErrorFormDataField } from "./error";

export type ProfileKeys = 
  'fistName' |
  'lastName' |
  'dateOfBirth' |
  'age'
  'email' |
  'religion' |
  'nationality' |
  'sex' |
  'bloodType' |
  'address' |
  'contactNumber' |
  'guardianName' |
  'guardianContactNumber' |
  'guardianIdFile' 


export interface ProfileFormData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  age: string|number;
  email: string;
  religion: string;
  nationality: string;
  sex: string;
  bloodType: string;
  address: string;
  contactNumber: string;
  guardianName: string;
  guardianContactNumber: string;
  guardianIdFile: string;
}

export interface ProfileErrorFormData {
  firstName: ErrorFormDataField;
  lastName: ErrorFormDataField;
  dateOfBirth: ErrorFormDataField;
  age: ErrorFormDataField;
  email: ErrorFormDataField;
  religion: ErrorFormDataField;
  nationality: ErrorFormDataField;
  sex: ErrorFormDataField;
  bloodType: ErrorFormDataField;
  address: ErrorFormDataField;
  contactNumber: ErrorFormDataField;
  guardianName: ErrorFormDataField;
  guardianContactNumber: ErrorFormDataField;
  guardianIdFile: ErrorFormDataField;
}


export interface UpdateProfileFormData {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  contactNumber: number;
  age: number;
  sex: string;
  role: string;
  createdAt: string;
  isArchived: boolean
}

export interface ArchiveProfileFormData {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  contactNumber: number;
  sex: string;
  dateOfBirth: string;
  address: string;
  role: string;
  isArchived: boolean
}