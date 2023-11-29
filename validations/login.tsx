import {
  isEmailValid,
  isPasswordValid
} from '../utils/validation-rules';
import { FormData, ErrorFormData } from '../types/login';
import { Dispatch, SetStateAction } from 'react';

export const isLoginFormValid = (formData: FormData, setErrorFormData: Dispatch<SetStateAction<ErrorFormData>>) => {
  let result = true;

  // Empty Fields
  for (const field in formData) {
    if (!formData[field as keyof FormData]) {
      setErrorFormData(prevErrorFormData => ({
        ...prevErrorFormData,
        [field]: {
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

  // Password Validation
  if (formData.password && !isPasswordValid(formData.password)) {
    setErrorFormData(prevErrorFormData => ({
      ...prevErrorFormData,
      ['password']: {
        error: true,
        message: 'Password is invalid'
      }
    }))

    result = false;
  }

  return result;
}