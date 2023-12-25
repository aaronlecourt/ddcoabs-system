import { ErrorFormDataField } from "./error";

export interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  contactNumber: string;
  dateOfBirth: string;
  sex: string;
  password: string;
  confirmPassword: string;
}

export interface ErrorFormData {
  firstName: ErrorFormDataField;
  lastName: ErrorFormDataField;
  email: ErrorFormDataField;
  address: ErrorFormDataField;
  contactNumber: ErrorFormDataField;
  dateOfBirth: ErrorFormDataField;
  sex: ErrorFormDataField;
  password: ErrorFormDataField;
  confirmPassword: ErrorFormDataField;
}