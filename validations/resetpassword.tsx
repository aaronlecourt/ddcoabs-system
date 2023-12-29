import {
    isPasswordValid
  } from '../utils/validation-rules';
  import { FormData, ErrorFormData } from '../types/resetpassword';
  import { Dispatch, SetStateAction } from 'react';
  
  export const isResetPasswordFormValid = (formData: FormData, errorFormData: ErrorFormData, setErrorFormData: Dispatch<SetStateAction<ErrorFormData>>) => {
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
  
    // Password Validation
    if (formData.newPassword && !isPasswordValid(formData.newPassword)) {
      setErrorFormData(prevErrorFormData => ({
        ...prevErrorFormData,
        ['newPassword']: {
          error: true,
          message: 'Password must contain at least 8 characters, 1 uppercase letter, and 1 special character'
        }
      }))
  
      result = false;
    }
  
    // Confirm Password Validation
    if (formData.confirmNewPassword && formData.confirmNewPassword && (formData.newPassword !== formData.confirmNewPassword)) {
      setErrorFormData(prevErrorFormData => ({
        ...prevErrorFormData,
        ['confirmNewPassword']: {
          error: true,
          message: 'Password does not match'
        }
      }))
  
      result = false;
    }
  
    return result;
  }