import { ErrorFormDataField } from "./error";

export interface FormData {
  newPassword: string;
  confirmNewPassword: string;
}

export interface ErrorFormData {
  newPassword: ErrorFormDataField;
  confirmNewPassword: ErrorFormDataField;
}