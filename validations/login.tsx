import {
  isEmailValid,
} from '../utils/validation-rules';
import { FormData, ErrorFormData } from '../types/login';
import { Dispatch, SetStateAction } from 'react';

export const isLoginFormValid = (formData: FormData, errorFormData: ErrorFormData, setErrorFormData: Dispatch<SetStateAction<ErrorFormData>>) => {
  let result = true;

  // Empty Fields
  for (const field in formData) {
    if (!formData[field as keyof FormData] && !errorFormData[field as keyof ErrorFormData].optional) {
      setErrorFormData(prevErrorFormData => ({
        ...prevErrorFormData,
        [field]: {
          optional: errorFormData[field as keyof ErrorFormData].optional || false,
          error: true,
          message: 'This field is required'
        }
      }))

      result = false;
    }
  }

  // Email Validation
  if (formData.email && !isEmailValid(formData.email)) {
    setErrorFormData(prevErrorFormData => ({
      ...prevErrorFormData,
      ['email']: {
        error: true,
        message: 'Email is invalid'
      }
    }))

    result = false;
  }

  return result;
}