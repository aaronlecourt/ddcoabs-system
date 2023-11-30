import { PatientFormData, PatientErrorFormData } from '../types/book';
import { Dispatch, SetStateAction } from 'react';

export const isPatientFormValid = (formData: PatientFormData, errorFormData: PatientErrorFormData, setErrorFormData: Dispatch<SetStateAction<PatientErrorFormData>>) => {
  let result = true;

  console.log(formData);

  // Empty Fields
  for (const field in formData) {
    if (!formData[field as keyof PatientFormData] && !errorFormData[field as keyof PatientErrorFormData].optional) {
      setErrorFormData(prevErrorFormData => ({
        ...prevErrorFormData,
        [field]: {
          optional: errorFormData[field as keyof PatientErrorFormData].optional || false,
          error: true,
          message: 'This field is required'
        }
      }))

      result = false;
    }
  }

  return result;
}