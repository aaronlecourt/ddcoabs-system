import { Dispatch, SetStateAction, forwardRef, useContext, useEffect, useImperativeHandle, useState } from 'react'
import { handleFormEnter, handleFormDataChange } from '../utils/form-handles'
import styles from '../styles/forms/patient.module.scss'
import { isPatientFormValid } from '../validations/patientform'
import { BookingFormContextDentist } from '../pages/book'
import Button from '../components/ArchiveButton'

export const PatientWalkIn = {
  patientName: '',
  age: 0,
  sex: '',
  contactNumber: 0,
  guardianName: '',
  guardianNumber: 0,
}

export const ErrorPatientFormObjectDentist = {
    firstName: { error: false, message: null },
    lastName: { error: false, message: null },
    age: { error: false, message: null },
    sex: { error: false, message: null },
    contactNumber: { error: false, message: null },
    guardianName: { optional: true, error: false, message: null },
    guardianNumber: { optional: true, error: false, message: null },
}

const BookPatientFormDentist = forwardRef(({ }: any, ref) => {
  const {
    patientFormDentist,
    setPatientFormDentist,
    patientErrorFormDataDentist,
    setPatientErrorFormDentist,
    onStepNext
  }: any = useContext(BookingFormContextDentist);

  const formData = patientFormDentist;
  const setFormData = setPatientFormDentist;
  const errorFormData = patientErrorFormDataDentist;
  const setErrorFormData = setPatientErrorFormDentist;

  const updatePatientName = (e: any) => {
    const { name, value } = e.target;

    setFormData((prevData: any) => ({
      ...prevData,
      [name]: value,
      patientName: `${prevData.firstName} ${prevData.lastName}` 
      
    }));
    console.log("PATIENT NAME: ", formData.patientName)
  };
  
  useEffect(() => {
    
  }, [])


  const next = (e: any) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    onStepNext(e);
  }

  useImperativeHandle(ref, () => ({
    checkValidForm: () => {
      return isPatientFormValid(formData, errorFormData, setErrorFormData)
    }
  }))

  return (
    <div className={styles.form}>
      <div className={styles.form__container}>
        <label> First Name: </label>
        <input type = "text" name='firstName' placeholder="Jane or John" onChange={(e) => {handleFormDataChange(e, setFormData, setErrorFormData); updatePatientName(e);}} value={formData.firstName}/>
      </div>
      <div className={styles.form__container}>
        <label> Last Name: </label>
        <input type = "text" name='lastName' placeholder='Doe' onChange={(e) => {handleFormDataChange(e, setFormData, setErrorFormData); updatePatientName(e);}} value={formData.lastName} />
      </div>

      <div className={styles.form__container}>
        <label> Age: </label>
        <input type = "number" name='age' onChange={e => handleFormDataChange(e, setFormData, setErrorFormData)} value={formData.age}/>
      </div>

      <div className={styles.form__container}>
        <span> Sex: </span>

        <input type = "radio" id='female' name='sex' value="Female" onChange={e => handleFormDataChange(e, setFormData, setErrorFormData)}/>
        <label htmlFor='female'> Female </label>
        
        <input type = "radio" id='male' name='sex' value="Male" onChange={e => handleFormDataChange(e, setFormData, setErrorFormData)}/>
        <label htmlFor='male'> Male </label>
        
      </div>

      <div className={styles.form__container}>
        <label> Contact Number: </label>
        <input type = "text" name='contactNumber' onChange={e => handleFormDataChange(e, setFormData, setErrorFormData)} value={formData.contactNumber}/>
      </div>

      <hr></hr>

      <div className={styles.form__container}>
        <label> Parent's or Guardians Name: </label>
        <input type = "text" placeholder='N/A' onChange={e => handleFormDataChange(e, setFormData, setErrorFormData)} name='guardianName' value={formData.guardianName}/>
      </div>

      <div className={styles.form__container}>
        <label> Contact Number: </label>
        <input type = "text" name='guardianNumber' onChange={e => handleFormDataChange(e, setFormData, setErrorFormData)} value={formData.guardianNumber}/>
      </div>

      <div className={styles.next}>
        <Button onClick={next}>Next</Button>
      </div>
      
    </div>
  )
})
export default BookPatientFormDentist;