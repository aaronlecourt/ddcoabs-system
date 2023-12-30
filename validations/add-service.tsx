import {
    isServiceNameValid,
    isServiceDescriptionValid,
    isPriceValid,
  } from '../utils/service_validation_rules';
  import { AddServicesFormData, ErrorAddServicesFormData } from '../types/services';
  import { Dispatch, SetStateAction } from 'react';
  
 // Example isAddServicesFormValid implementation
export const isAddServicesFormValid = (
  formData: AddServicesFormData,
  errorData: ErrorAddServicesFormData,
  setErrorData: React.Dispatch<React.SetStateAction<ErrorAddServicesFormData>>
): boolean => {
  let isValid = true;

  // Validate 'name'
  const nameField = 'name';
  if (!formData[nameField].trim()) {
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
  if (!formData[priceField].trim()) {
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
  if (!formData[descriptionField].trim()) {
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

  return isValid;
};

