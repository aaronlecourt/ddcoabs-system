import {
  isFirstNameValid,
  isLastNameValid,
  isEmailValid,
  isMobileNumberValid,
  isDateOfBirthValid,
  isPasswordValid
} from '../utils/validation-rules';
import { FormData, ErrorFormData } from '../types/register';
import { Dispatch, SetStateAction } from 'react';

export const isRegistrationFormValid = (formData: FormData, errorFormData: ErrorFormData, setErrorFormData: Dispatch<SetStateAction<ErrorFormData>>) => {
  let result = true;

  // Empty Fields
  for (const field in formData) {
    // if (!formData[field as keyof FormData] && !errorFormData[field as keyof ErrorFormData].optional) {
    //   setErrorFormData(prevErrorFormData => ({
    //     ...prevErrorFormData,
    //     [field]: {
    //       optional: errorFormData[field as keyof ErrorFormData].optional || false,
    //       error: true,
    //       message: 'This field is required'
    //     }
    //   }))

    //   result = false;
    // }

    if (!formData[field as keyof FormData] && !errorFormData[field as keyof ErrorFormData]?.optional) {
      setErrorFormData(prevErrorFormData => ({
        ...prevErrorFormData,
        [field]: {
          ...prevErrorFormData[field as keyof ErrorFormData],
          required: true,
        },
      }));
    }
  }

  // First Name Validation
  if (formData.firstName && !isFirstNameValid(formData.firstName)) {
    setErrorFormData(prevErrorFormData => ({
      ...prevErrorFormData,
      ['firstName']: {
        error: true,
        message: 'Must be minimum of 2 characters.'
      }
    }))

    result = false;
  }

  // Last Name Validation
  if (formData.lastName && !isFirstNameValid(formData.lastName)) {
    setErrorFormData(prevErrorFormData => ({
      ...prevErrorFormData,
      ['lastName']: {
        error: true,
        message: 'Must be minimum of 2 characters.'
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

  // Mobile Number Validation
  if (formData.contactNumber && !isMobileNumberValid(formData.contactNumber)) {
    setErrorFormData(prevErrorFormData => ({
      ...prevErrorFormData,
      ['contactNumber']: {
        error: true,
        message: 'Mobile Number is invalid'
      }
    }))

    result = false;
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

  // Password Validation
  if (formData.password && !isPasswordValid(formData.password)) {
    setErrorFormData(prevErrorFormData => ({
      ...prevErrorFormData,
      ['password']: {
        error: true,
        message: 'Password must contain at least 8 characters, 1 uppercase letter, and 1 special character'
      }
    }))

    result = false;
  }

  // Confirm Password Validation
  if (formData.password && formData.confirmPassword && (formData.password !== formData.confirmPassword)) {
    setErrorFormData(prevErrorFormData => ({
      ...prevErrorFormData,
      ['confirmPassword']: {
        error: true,
        message: 'Password does not match'
      }
    }))

    result = false;
  }

  return result;
}