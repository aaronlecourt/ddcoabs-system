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