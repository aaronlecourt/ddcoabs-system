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
  physicianName: string;
  officeAddress: string;
  specialty: string;
  goodHealth: string;
  medicalTreatment: string;
  medicalTreatmentValue: string;
  illness: string;
  illnessValue: string;
  hospitalized: string;
  hospitalizedValue: string;
  medication: string;
  medicationValue: string;
  tobacco: string;
  alchohol: string;
  allergy: string;
  allergyValue: string;
  pregnant: string;
  nursing: string;
  birthControl: string;
  others: string[];
  previousDentist: string;
  previousTreatment: string;
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