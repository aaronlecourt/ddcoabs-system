import { ErrorFormDataField } from "./error";

export interface FormData {
  email: string;
  password: string;
}

export interface ErrorFormData {
  email: ErrorFormDataField;
  password: ErrorFormDataField;
}