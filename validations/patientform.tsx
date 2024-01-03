import { PatientFormData, PatientErrorFormData, PatientFormDataDentist, PatientErrorFormDataDentist } from '../types/book';
import { Dispatch, SetStateAction } from 'react';
import { isInput50Chars, isInput25Chars, atLeast5Chars, isFirstNameValid, isMobileNumberValid} from '../utils/validation-rules';

const atLeast5Char: Array<keyof PatientFormData> = [
  'physicianName',
  'officeAddress',
  'medicalTreatmentValue',
  'illnessValue',
  'hospitalizedValue',
  'medicationValue',
  'allergyValue',
  'previousDentist',
  'specialty',
  'previousTreatment'
];

const keysRequiring50CharsValidation: Array<keyof PatientFormData> = [
  'physicianName',
  'officeAddress',
  'medicalTreatmentValue',
  'illnessValue',
  'hospitalizedValue',
  'medicationValue',
  'allergyValue',
  'previousDentist',
];

const keysRequiring25CharsValidation: Array<keyof PatientFormData> = [
  'specialty',
  'previousTreatment'
];

export const isPatientFormValid = (
  formData: PatientFormData, 
  errorFormData: PatientErrorFormData, setErrorFormData: Dispatch<SetStateAction<PatientErrorFormData>>) => {
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

  // Validation for at least 5 characters
  atLeast5Char.forEach((key) => {
    const fieldValue = formData[key];
    if (fieldValue && !atLeast5Chars(fieldValue as string)) {
      setErrorFormData((prevErrorFormData) => ({
        ...prevErrorFormData,
        [key]: {
          error: true,
          message: `Input must be at least 5 characters long`,
        },
      }));
      result = false;
    }
  });

  // Validation for 50 character length
  keysRequiring50CharsValidation.forEach((key) => {
    const fieldValue = formData[key];
    if (fieldValue && !isInput50Chars(fieldValue as string)) {
      setErrorFormData((prevErrorFormData) => ({
        ...prevErrorFormData,
        [key]: {
          error: true,
          message: `Input can only be 50 characters long`,
        },
      }));
      result = false;
    }
  });

  // Validation for 25 character length
  keysRequiring25CharsValidation.forEach((key) => {
    const fieldValue = formData[key];
    if (fieldValue && !isInput25Chars(fieldValue as string)) {
      setErrorFormData((prevErrorFormData) => ({
        ...prevErrorFormData,
        [key]: {
          error: true,
          message: `'${key}' input can only be 25 characters long`,
        },
      }));
      result = false;
    }
  });

  // Check if formData.others length is not 0
  if (formData.others && formData.others.length === 0) {
    setErrorFormData((prevErrorFormData) => ({
      ...prevErrorFormData,
      others: {
        error: true,
        message: 'Please select at least one option or fill in Others',
      },
    }));
    result = false;
  }
  return result;
}

export const isWalkInPatientFormValid = (formData: PatientFormDataDentist, errorFormData: PatientErrorFormDataDentist, setErrorFormData: Dispatch<SetStateAction<PatientErrorFormDataDentist>>) => {
  let result = true;

  console.log(formData);

  // Empty Fields
  for (const field in formData) {
    if (!formData[field as keyof PatientFormDataDentist] && !errorFormData[field as keyof PatientErrorFormDataDentist].optional) {
      setErrorFormData(prevErrorFormData => ({
        ...prevErrorFormData,
        [field]: {
          optional: errorFormData[field as keyof PatientErrorFormDataDentist].optional || false,
          error: true,
          message: 'This field is required'
        }
      }))

      result = false;
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

  // Mobile Number Validation
  if (formData.guardianNumber && !isMobileNumberValid(formData.guardianNumber)) {
    setErrorFormData(prevErrorFormData => ({
      ...prevErrorFormData,
      ['guardianNumber']: {
        optional: errorFormData.guardianNumber.optional || false,
        error: true,
        message: 'Mobile Number is invalid'
      }
    }))

    result = false;
  }

  return result;
}