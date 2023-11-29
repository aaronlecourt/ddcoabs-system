import {
  isEmailValid,
  isMobileNumberValid,
  isDateOfBirthValid,
} from '../utils/validation-rules';
import { FormData, ErrorFormData } from '../types/profile';
import { Dispatch, SetStateAction } from 'react';

export const isProfileFormValid = (formData: FormData, errorFormData: ErrorFormData, setErrorFormData: Dispatch<SetStateAction<ErrorFormData>>) => {
  let result = true;

  // Empty Fields
  for (const field in formData) {
    if (!formData[field as keyof FormData] && !errorFormData[field as keyof ErrorFormData].optional) {
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

  // Date of Birth Validation
  if (formData.dateOfBirth && !isDateOfBirthValid(formData.dateOfBirth)) {
    setErrorFormData(prevErrorFormData => ({
      ...prevErrorFormData,
      ['dateOfBirth']: {
        error: true,
        message: 'Date of Birth is invalid'
      }
    }))

    result = false;
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

  // Contact Number Validation
  if (formData.contactNumber && !isMobileNumberValid(formData.contactNumber)) {
    setErrorFormData(prevErrorFormData => ({
      ...prevErrorFormData,
      ['contactNumber']: {
        error: true,
        message: 'Contact Number is invalid'
      }
    }))

    result = false;
  }

  // Guardian Contact Number Validation
  if (formData.guardianContactNumber && !isMobileNumberValid(formData.guardianContactNumber)) {
    setErrorFormData(prevErrorFormData => ({
      ...prevErrorFormData,
      ['guardianContactNumber']: {
        optional: prevErrorFormData['guardianContactNumber'].optional,
        error: true,
        message: 'Guardian Contact Number is invalid'
      }
    }))

    result = false;
  }

  return result;
}