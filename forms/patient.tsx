import { Dispatch, SetStateAction, forwardRef, useContext, useEffect, useImperativeHandle, useState } from 'react'
import { PatientFormData, PatientErrorFormData, Question, PatientFormCheckbox } from '../types/book'
import { handleFormEnter, handleFormDataChange } from '../utils/form-handles'
import styles from '../styles/forms/patient.module.scss'
import { isPatientFormValid } from '../validations/patientform'
import CheckBox from '../components/CheckBox'
import Button from '../components/Button'
import { BookingFormContext } from '../pages/book'

export const PatientFormObject = {
  physicianName: '',
  officeAddress: '',
  specialty: '',
  goodHealth: '',
  medicalTreatment: '',
  medicalTreatmentValue: '',
  illness: '',
  illnessValue: '',
  hospitalized: '',
  hospitalizedValue: '',
  medication: '',
  medicationValue: '',
  tobacco: '',
  alchohol: '',
  allergy: '',
  allergyValue: '',
  pregnant: '',
  nursing: '',
  birthControl: '',
  others: [],
  previousDentist: '',
  previousTreatment: '',
  lastDentalVisit: ''
}

export const ErrorPatientFormObject = {
  physicianName: { error: false, message: null },
  officeAddress: { optional: true, error: false, message: null },
  specialty: { optional: true, error: false, message: null },
  goodHealth: { error: false, message: null },
  medicalTreatment: { error: false, message: null },
  medicalTreatmentValue: { optional: true, error: false, message: null },
  illness: { error: false, message: null },
  illnessValue: { optional: true, error: false, message: null },
  hospitalized: { error: false, message: null },
  hospitalizedValue: { optional: true, error: false, message: null },
  medication: { error: false, message: null },
  medicationValue: { optional: true, error: false, message: null },
  tobacco: { error: false, message: null },
  alchohol: { error: false, message: null },
  allergy: { error: false, message: null },
  allergyValue: { optional: true, error: false, message: null },
  pregnant: { optional: true, error: false, message: null },
  nursing: { optional: true, error: false, message: null },
  birthControl: { optional: true, error: false, message: null },
  others: { optional: true, error: false, message: null },
  previousDentist: { optional: true, error: false, message: null },
  previousTreatment: { optional: true, error: false, message: null },
  lastDentalVisit: { optional: true, error: false, message: null }
}

export const PatientFormCheckboxList = [
  [
    {
      id: '1',
      text: 'High Blood Pressure',
      value: false,
    },
    {
      id: '2',
      text: 'Heart Disease',
      value: false,
    },
    {
      id: '3',
      text: 'Anemia',
      value: false,
    },
  ],
  [
    {
      id: '4',
      text: 'Low Blood Pressure',
      value: false,
    },
    {
      id: '5',
      text: 'Heart Murmur',
      value: false,
    },
    {
      id: '6',
      text: 'Others',
      value: true,
      textbox: true,
      textValue: ''
    }
  ]
]

const BookPatientForm = forwardRef(({ }: any, ref) => {
  const {
    patientForm,
    setPatientForm,
    patientErrorForm,
    setPatientErrorForm,
    patientFormCheckbox,
    setPatientFormCheckbox,
    onStepNext
  }: any = useContext(BookingFormContext);
  const formData = patientForm;
  const setFormData = setPatientForm;
  const errorFormData = patientErrorForm;
  const setErrorFormData = setPatientErrorForm;
  const checkboxList: Array<PatientFormCheckbox[]> = patientFormCheckbox;
  const setCheckboxList: Dispatch<SetStateAction<Array<PatientFormCheckbox[]>>> = setPatientFormCheckbox;
  const [initialQuestions] = useState<Array<Question[]>>([
    [
      {
        question: 'Name of Physician: ',
        key: 'physicianName',
      },
      {
        question: 'Office Address: ',
        key: 'officeAddress',
      },
    ],
    [
      {
        question: 'Specialty, if applicable: ',
        key: 'specialty',
        customWidth: 0.5
      },
    ]
  ])

  const [dentalHistoryQuestions] = useState<Question[]>([
    {
      question: 'Previous Dentist: ',
      key: 'previousDentist',
    },
    {
      question: 'Previous Treatment: ',
      key: 'previousTreatment',
    },
    {
      question: 'Last Dental Visit: ',
      key: 'lastDentalVisit',
    },
  ])

  const [questions] = useState<Question[]>([
    {
      question: 'Are you in good health?',
      key: 'goodHealth',
    },
    {
      question: 'Are you under medical treatment now?',
      key: 'medicalTreatment',
      others: {
        question: 'If so, what is the condition being treated?',
        key: 'medicalTreatmentValue',
      }
    },
    {
      question: 'Have you ever had a serious illness or surgical operation?',
      key: 'illness',
      others: {
        question: 'If so, what illness or operation?',
        key: 'illnessValue',
      }
    },
    {
      question: 'Have you ever been hospitalized?',
      key: 'hospitalized',
      others: {
        question: 'If so, when and why?',
        key: 'hospitalizedValue',
      }
    },
    {
      question: 'Are you taking any prescription/non-prescription medication?',
      key: 'medication',
      others: {
        question: 'If so, please specify',
        key: 'medicationValue',
      }
    },
    {
      question: 'Do you use tobacco products?',
      key: 'tobacco',
    },
    {
      question: 'Do you use alcohol, cocaine, or other dangerous drugs?',
      key: 'alchohol',
    },
    {
      question: 'Are you allergic to any of the following:',
      key: 'allergy',
      others: {
        question: 'If so, please specify',
        key: 'allergyValue',
      }
    },
    {
      note: 'For women only: ',
      question: 'Are you pregnant?',
      key: 'pregnant',
      subQuestions: [
        {
          question: 'Are you nursing?',
          key: 'nursing'
        },
        {
          question: 'Are you taking birth control pills?',
          key: 'birthControl'
        }
      ]
    },
    {
      question: 'Do you have or have you had any of the following? Check which apply: ',
      key: 'others',
      type: 'checkbox',
    }
  ])

  // useEffect(() => {
  //   if (formData['others'].length > 0) {
  //     const symptoms = checkboxList.flatMap(row => row).map(i => i.textValue || i.text);

  //     setCheckboxList(prevValue => {
  //       const updatedValues = prevValue.map(row => {
  //         const updatedRow = row.map(cell => {
  //           if (formData['others'].includes(cell.text)) {
  //             return { ...cell, value: true }
  //           } else {
  //             if (!cell.textbox) return { ...cell }
  //             else {
  //               const text = formData['others'][formData['others'].length - 1];
  //               if (!symptoms.includes(text)) {
  //                 return { ...cell, textValue: formData['others'][formData['others'].length - 1] }
  //               } else {
  //                 return { ...cell }
  //               }
  //             }
  //           }
  //         })
  //         return updatedRow;
  //       })
  //       return updatedValues;
  //     })
  //   }
  // }, [])

  useEffect(() => {
    // for question 10
    const symptoms = checkboxList.flatMap(row =>
      row.filter(checkbox => checkbox.value)
    ).map(i => i.textValue || i.text);

    setFormData((prevFormData: any) => ({
      ...prevFormData,
      ['others']: symptoms
    }))
  }, [checkboxList])

  const handleCheckboxChange = (rowIndex: number, index: number, textValue?: string) => {
    setCheckboxList((prevState) => {
      const updatedCheckboxes = prevState.map((row, i) =>
        i === rowIndex
          ? row.map((checkbox, j) =>
            j === index ? { ...checkbox, value: !checkbox.value, textValue: textValue || '' } : checkbox
          )
          : row
      );

      return updatedCheckboxes;
    });
  };

  const next = (e: any) => {
    e.preventDefault();

    // for question 10
    const symptoms = checkboxList.flatMap(row =>
      row.filter(checkbox => checkbox.value)
    ).map(i => i.textValue || i.text);

    onStepNext(e);
  }

  useImperativeHandle(ref, () => ({
    checkValidForm: () => {
      return isPatientFormValid(formData, errorFormData, setErrorFormData)
    }
  }))

  return (
    <div className={styles.form}>
      {initialQuestions.map((rowQuestions, index) =>
        <div key={`rowQuestions-${index + 1}`} className={styles.form__row}>
          {rowQuestions.map(question =>
            <div key={question.key} className={styles.form__row__field} style={{ flex: question.customWidth ? question.customWidth : 1 }}>
              <div className={`formLabel ${styles.form__row__field__label}`}>
                <label>{question.question}</label>
              </div>
              <div className={`formInput ${errorFormData[question.key].error ? 'formInput--error' : ''}`}>
                {errorFormData[question.key].error && <span className='formInput__errorMessage'>{errorFormData[question.key].message}</span>}
                <input type='text'
                  onKeyDown={e => handleFormEnter(e, next)}
                  name={question.key}
                  value={formData[question.key]}
                  onChange={e => handleFormDataChange(e, setFormData, setErrorFormData)}
                />
              </div>
            </div>
          )}
        </div>
      )}
      <div className={styles.form__container}>
        <div className={styles.form__column}>
          {questions.map((question, index) =>
            <div key={question.key}>
              <div className={styles.form__column__field}>
                <div className={styles.form__column__field__number}>{index + 1}</div>
                <div className={`formLabelColumn ${styles.form__column__field__label}`}>
                  <label style={{ fontWeight: 700 }}>
                    {question.note && <strong>{question.note}</strong>}
                    {question.question}
                  </label>
                  {errorFormData[question.key].error && <span className='formLabel__errorMessage'>{errorFormData[question.key].message}</span>}
                </div>
                {(!question.type || (question.type && question.type !== 'checkbox')) &&
                  <div className={styles.form__column__field__selection}>
                    <div className={styles.form__column__field__center}>
                      <input type='radio' checked={formData[question.key] === 'yes'} name={question.key} id={`yes-${question.key}`} className={errorFormData[question.key].error ? 'error' : ''} value='yes' onChange={e => handleFormDataChange(e, setFormData, setErrorFormData)} />
                      <label htmlFor={`yes-${question.key}`}>Yes</label>
                    </div>
                    <div className={styles.form__column__field__center}>
                      <input type='radio' checked={formData[question.key] === 'no'} name={question.key} id={`no-${question.key}`} className={errorFormData[question.key].error ? 'error' : ''} value='no' onChange={e => handleFormDataChange(e, setFormData, setErrorFormData)} />
                      <label htmlFor={`no-${question.key}`}>No</label>
                    </div>
                  </div>
                }
              </div>
              {question.others &&
                <div className={`${styles.form__column__field} ${styles.form__column__fieldOthers}`}>
                  <div className={`formLabel ${styles.form__column__field__label}`}>
                    <label>{question.others.question}</label>
                  </div>
                  <div className={`formInput ${errorFormData[question.others.key].error ? 'formInput--error' : ''}`}>
                    {errorFormData[question.others.key].error && <span className='formInput__errorMessage'>{errorFormData[question.others.key].message}</span>}
                    <input type='text'
                      onKeyDown={e => handleFormEnter(e, next)}
                      name={question.others.key}
                      value={formData[question.others.key]}
                      onChange={e => handleFormDataChange(e, setFormData, setErrorFormData)}
                    />
                  </div>
                </div>
              }
              {question.subQuestions?.map(sub =>
                <div key={sub.key} className={`${styles.form__column__field} ${styles.form__column__fieldOthers}`}>
                  <div className={`formLabelColumn ${styles.form__column__field__label}`}>
                    <label style={{ fontWeight: 700 }}>
                      {question.note && <strong style={{ visibility: 'hidden' }}>{question.note}</strong>}
                      {sub.question}
                    </label>
                    {errorFormData[sub.key].error && <span className='formLabel__errorMessage'>{errorFormData[sub.key].message}</span>}
                  </div>
                  <div className={styles.form__column__field__selection}>
                    <div className={styles.form__column__field__center}>
                      <input type='radio' checked={formData[sub.key] === 'yes'} name={sub.key} id={`yes-${sub.key}`} className={errorFormData[sub.key].error ? 'error' : ''} value='yes' onChange={e => handleFormDataChange(e, setFormData, setErrorFormData)} />
                      <label htmlFor={`yes-${sub.key}`}>Yes</label>
                    </div>
                    <div className={styles.form__column__field__center}>
                      <input type='radio' checked={formData[sub.key] === 'no'} name={sub.key} id={`no-${sub.key}`} className={errorFormData[sub.key].error ? 'error' : ''} value='no' onChange={e => handleFormDataChange(e, setFormData, setErrorFormData)} />
                      <label htmlFor={`no-${sub.key}`}>No</label>
                    </div>
                  </div>
                </div>
              )}
              {question.type === 'checkbox' && (
                <div className={styles.checkboxList}>
                  {checkboxList.map((list, rowIndex) =>
                    <div key={`checkboxList-${rowIndex}`} className={styles.checkboxList__row}>
                      {list.map((item, index) =>
                        !item.textbox ? <CheckBox key={item.id} id={item.id} value={item.value} setValue={() => handleCheckboxChange(rowIndex, index)}>
                          {item.text}
                        </CheckBox> :
                          <div key={item.id} className={`${styles.form__column__field} ${styles.col}`}>
                            <div className={`formLabel ${styles.form__column__field__label}`}>
                              <label>{item.text}</label>
                            </div>
                            <div className='formInput'>
                              <input type='text'
                                onKeyDown={e => handleFormEnter(e, next)}
                                name={item.id}
                                value={item.textValue}
                                onChange={(e) => handleCheckboxChange(rowIndex, index, e.target.value)}
                              />
                            </div>
                          </div>
                      )}
                    </div>
                  )}

                </div>
              )}
            </div>
          )}
        </div>
        <div className={styles.form__column} style={{ flex: 0.5, marginLeft: '2rem' }}>
          <h3>Dental History</h3>
          <div className={styles.form}>
            {dentalHistoryQuestions.map(question =>
              <div key={question.key} className={`${styles.form__column__field} ${styles.col}`} style={{ flex: question.customWidth ? question.customWidth : 1 }}>
                <div className={`formLabel ${styles.form__column__field__label}`}>
                  <label>{question.question}</label>
                </div>
                <div className={`formInput ${errorFormData[question.key].error ? 'formInput--error' : ''}`}>
                  {errorFormData[question.key].error && <span className='formInput__errorMessage'>{errorFormData[question.key].message}</span>}
                  <input type='text'
                    onKeyDown={e => handleFormEnter(e, next)}
                    name={question.key}
                    value={formData[question.key]}
                    onChange={e => handleFormDataChange(e, setFormData, setErrorFormData)}
                  />
                </div>
              </div>
            )}
            <div className={styles.next}>
              <Button onClick={next}>Next</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})
export default BookPatientForm;