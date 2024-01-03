import { ErrorFormDataField } from "./error";

type Keys = 
  'physicianName' |
  'officeAddress' |
  'specialty' |
  'goodHealth' |
  'medicalTreatment' |
  'medicalTreatmentValue' |
  'illness' |
  'illnessValue' |
  'hospitalized' |
  'hospitalizedValue' |
  'medication' |
  'medicationValue' |
  'tobacco' |
  'alchohol' |
  'allergy' |
  'allergyValue' |
  'pregnant' |
  'nursing' |
  'birthControl' |
  'others' |
  'previousDentist' |
  'previousTreatment' |
  'lastDentalVisit';

export interface Question {
  note?: string;
  question: string;
  key: Keys;
  customWidth?: number;
  others?: Question;
  subQuestions?: Question[];
  type?: string;
}

export interface PatientFormData {
  physicianName: string; //50
  officeAddress: string; //50
  specialty: string; //25
  goodHealth: string;
  medicalTreatment: string;
  medicalTreatmentValue: string;  //50
  illness: string;
  illnessValue: string; //50
  hospitalized: string;
  hospitalizedValue: string; //50
  medication: string;
  medicationValue: string; //50
  tobacco: string;
  alchohol: string;
  allergy: string;
  allergyValue: string; //50
  pregnant: string;
  nursing: string;
  birthControl: string;
  others: string[];
  previousDentist: string; //50
  previousTreatment: string; //25
  lastDentalVisit: string;
}

export interface PatientErrorFormData {
  physicianName: ErrorFormDataField;
  officeAddress: ErrorFormDataField;
  specialty: ErrorFormDataField;
  goodHealth: ErrorFormDataField;
  medicalTreatment: ErrorFormDataField;
  medicalTreatmentValue: ErrorFormDataField;
  illness: ErrorFormDataField;
  illnessValue: ErrorFormDataField;
  hospitalized: ErrorFormDataField;
  hospitalizedValue: ErrorFormDataField;
  medication: ErrorFormDataField;
  medicationValue: ErrorFormDataField;
  tobacco: ErrorFormDataField;
  alchohol: ErrorFormDataField;
  allergy: ErrorFormDataField;
  allergyValue: ErrorFormDataField;
  pregnant: ErrorFormDataField;
  nursing: ErrorFormDataField;
  birthControl: ErrorFormDataField;
  others: ErrorFormDataField;
  previousDentist: ErrorFormDataField;
  previousTreatment: ErrorFormDataField;
  lastDentalVisit: ErrorFormDataField;
}

export interface PatientFormCheckbox {
  id: string;
  text: string;
  value: boolean;
  textbox?: boolean;
  textValue?: string;
}

export interface ServicesFormData {
  service: string;
  concern: string;
}

export interface ServicesErrorFormData {
  service: ErrorFormDataField;
  concern: ErrorFormDataField;
}

export interface PatientFormDataDentist {
  firstName: string;
  lastName: string;
  age: number;
  sex: string;
  contactNumber: string;
  guardianName: string;
  guardianNumber: string;
}

export interface PatientErrorFormDataDentist {
  firstName: ErrorFormDataField;
  lastName: ErrorFormDataField;
  age: ErrorFormDataField;
  sex: ErrorFormDataField;
  contactNumber: ErrorFormDataField;
  guardianName: ErrorFormDataField;
  guardianNumber: ErrorFormDataField;
}