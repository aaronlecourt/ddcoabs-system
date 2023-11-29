import { ErrorFormDataField } from "./error";

export interface FormData {
  fullName: string;
  email: string;
  address: string;
  mobileNumber: string;
  dateOfBirth: string;
  sex: string;
  password: string;
  confirmPassword: string;
}

export interface ErrorFormData {
  fullName: ErrorFormDataField;
  email: ErrorFormDataField;
  address: ErrorFormDataField;
  mobileNumber: ErrorFormDataField;
  dateOfBirth: ErrorFormDataField;
  sex: ErrorFormDataField;
  password: ErrorFormDataField;
  confirmPassword: ErrorFormDataField;
}