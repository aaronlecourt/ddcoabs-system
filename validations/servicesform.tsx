import { ServicesFormData, ServicesErrorFormData } from '../types/book';
import { Dispatch, SetStateAction } from 'react';

export const isServicesFormValid = (formData: ServicesFormData, errorFormData: ServicesErrorFormData, setErrorFormData: Dispatch<SetStateAction<ServicesErrorFormData>>) => {
  let result = true;

  console.log(formData);

  // Empty Fields
  for (const field in formData) {
    if (!formData[field as keyof ServicesFormData] && !errorFormData[field as keyof ServicesErrorFormData].optional) {
      setErrorFormData(prevErrorFormData => ({
        ...prevErrorFormData,
        [field]: {
          optional: errorFormData[field as keyof ServicesErrorFormData].optional || false,
          error: true,
          message: 'This field is required'
        }
      }))

      result = false;
    }
  }

  return result;
}