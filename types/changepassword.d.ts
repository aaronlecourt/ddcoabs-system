import { ErrorFormDataField } from "./error";

export interface FormData {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface ErrorFormData {
  oldPassword: ErrorFormDataField;
  newPassword: ErrorFormDataField;
  confirmNewPassword: ErrorFormDataField;
}