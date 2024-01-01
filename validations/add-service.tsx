import {
  isServiceNameValid,
  isServiceDescriptionValid,
  isPriceValid,
} from '../utils/service_validation_rules';
import { AddServicesFormData, UpdateServicesFormData,  ErrorAddServicesFormData, ErrorFormData, ErrorUpdateServicesFormData } from '../types/services';
import { Dispatch, SetStateAction } from 'react';

// Validation function for both add and update services
export const isServiceFormValid = (
  formData: AddServicesFormData | UpdateServicesFormData,
  errorData: ErrorFormData,
  setErrorData: React.Dispatch<React.SetStateAction<ErrorFormData>>
): boolean => {
  let isValid = true;

  // Validate 'name'
  const nameField = 'name';
  if (!isServiceNameValid(formData[nameField])) {
    setErrorData((prevErrorData) => ({
      ...prevErrorData,
      [nameField]: { error: true, message: 'Name is required.' },
    }));
    isValid = false;
  } else {
    setErrorData((prevErrorData) => ({
      ...prevErrorData,
      [nameField]: { error: false, message: null },
    }));
  }

  // Validate 'price'
  const priceField = 'price';
  if (!isPriceValid(formData[priceField])) {
    setErrorData((prevErrorData) => ({
      ...prevErrorData,
      [priceField]: { error: true, message: 'Price is required.' },
    }));
    isValid = false;
  } else {
    setErrorData((prevErrorData) => ({
      ...prevErrorData,
      [priceField]: { error: false, message: null },
    }));
  }

  // Validate 'description'
  const descriptionField = 'description';
  if (!isServiceDescriptionValid(formData[descriptionField])) {
    setErrorData((prevErrorData) => ({
      ...prevErrorData,
      [descriptionField]: { error: true, message: 'Description is required.' },
    }));
    isValid = false;
  } else {
    setErrorData((prevErrorData) => ({
      ...prevErrorData,
      [descriptionField]: { error: false, message: null },
    }));
  }

  console.log('isValid:', isValid);

  return isValid;
};

