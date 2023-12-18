import { ErrorFormDataField } from "./error";

export type ProfileKeys = 
  'name' |
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
  name: string;
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
  name: ErrorFormDataField;
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
  name: string;
  email: string;
  contactNumber: number;
  age: number;
  gender: string;
  OGrole: string;
  createdAt: string;
  isArchived: boolean
}

export interface ArchiveProfileFormData {
  _id: string;
  name: string;
  email: string;
  contactNumber: number;
  gender: string;
  dateOfBirth: string;
  address: string;
  role: string;
  isArchived: boolean
}