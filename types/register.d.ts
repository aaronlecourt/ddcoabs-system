import { ErrorFormDataField } from "./error";

export interface FormData {
  name: string;
  email: string;
  address: string;
  contactNumber: string;
  dateOfBirth: string;
  sex: string;
  password: string;
  confirmPassword: string;
}

export interface ErrorFormData {
  name: ErrorFormDataField;
  email: ErrorFormDataField;
  address: ErrorFormDataField;
  contactNumber: ErrorFormDataField;
  dateOfBirth: ErrorFormDataField;
  sex: ErrorFormDataField;
  password: ErrorFormDataField;
  confirmPassword: ErrorFormDataField;
}