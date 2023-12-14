import { ErrorAddServicesFormData } from "./error";

export interface AddServicesFormData {
  name: string;
  price: string;
  description: string;
}

export interface ErrorAddServicesFormData {
  name: ErrorAddServicesFormDataField;
  price: ErrorAddServicesFormDataField;
  description: ErrorAddServicesFormDataField;
}

export interface UpdateServicesFormData {
  _id: string;
  name: string;
  price: string;
  description: string;
}