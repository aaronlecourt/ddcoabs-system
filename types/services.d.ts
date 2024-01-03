import { ErrorAddServicesFormData } from "./error";

export interface Service {
  _id: string;
  name: string;
  price: string;
  description: string;
}

export interface ErrorFormData {
  name: { error: boolean; message: string | null };
  price: { error: boolean; message: string | null };
  type: { error: boolean; message: string | null };
  description: { error: boolean; message: string | null };
}

export interface AddServicesFormData {
  name: string;
  price: string;
  description: string;
  type: string;
  isArchived: boolean;
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
  type: string;
  createdAt: string;
  updatedAt: string;
  isArchived: boolean;
}

export interface ErrorUpdateServicesFormData {
  name: ErrorUpdateServicesFormData;
  price: ErrorUpdateServicesFormData;
  description: ErrorUpdateServicesFormData;
}