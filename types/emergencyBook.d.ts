import { ErrorFormDataField } from "./error";

// type Keys = 
//   'firstName' |
//     'lastName' |
//     'age' |
//     'sex' |
//     'contactNumber' 
//   ;

// export interface Question {
//   note?: string;
//   question: string;
//   // key: Keys;
//   customWidth?: number;
//   others?: Question;
//   subQuestions?: Question[];
//   type?: string;
// }

export interface PatientFormDataDentist {
    firstName: string;
    lastName: string;
    age: number;
    sex: string;
    contactNumber: number;
    guardianName: string;
    guardianNumber: number;
}

export interface PatientErrorFormDataDentist {
    firstName: ErrorFormDataField;
    lastName: ErrorFormDataField;
    age: ErrorFormDataField;
    sex: ErrorFormDataField;
    contactNumber: ErrorFormDataField;
}
