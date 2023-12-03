import styles from '../styles/pages/book.module.scss'
import PatientLayout from '../layouts/PatientLayout';
import DentistLayout from '../layouts/DentistLayout';
import useAuthGuard from '../guards/auth.guard';
import Steps from '../components/Steps';
import { useRef, useState, forwardRef, createContext } from 'react';
import { BookPatientForm } from '../forms';
import ServicesForm from '../forms/services';
import { PatientErrorFormData, PatientFormCheckbox, PatientFormData } from '../types/book';
import { ErrorPatientFormObject, PatientFormCheckboxList, PatientFormObject } from '../forms/patient';

export const BookingFormContext = createContext({})

export default function Book() {
  const { session, status } = useAuthGuard();

  const stepsRef = useRef(null)
  const formRef = useRef(null)

  const onStepNext = (e: any, index?: number) => {
    e.preventDefault();

    let stepValid = false;

    if (formRef.current) {
      const { checkValidForm }: { checkValidForm: () => boolean } = formRef.current;
      stepValid = checkValidForm()
    }

    if ((stepValid || (index !== undefined && index < currentStepIndex)) && stepsRef.current) {
      const { setActiveStep }: { setActiveStep: (e: any, index: number) => void } = stepsRef.current;
      setActiveStep(e, index !== undefined ? index : currentStepIndex + 1)
    }
  }

  const [steps, setSteps] = useState([
    {
      label: 'Patient Form',
      active: true,
      component: () => <BookPatientForm ref={formRef} nextStep={onStepNext} />,
      current: true
    },
    {
      label: 'Services',
      active: false,
      component: () => <ServicesForm ref={formRef} nextStep={onStepNext} />,
      current: false
    },
    {
      label: 'Date & Time',
      active: false,
      component: (nextStep: any) => <></>
    },
    {
      label: 'Payment',
      active: false,
      component: (nextStep: any) => <></>
    },
    {
      label: 'Confirmation',
      active: false,
      component: (nextStep: any) => <></>
    }
  ])
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [currentStep, setCurrentStep] = useState(steps[currentStepIndex])
  const [patientForm, setPatientForm] = useState<PatientFormData>(PatientFormObject)
  const [patientErrorForm, setPatientErrorForm] = useState<PatientErrorFormData>(ErrorPatientFormObject)
  const [patientFormCheckbox, setPatientFormCheckbox] = useState<Array<PatientFormCheckbox[]>>(PatientFormCheckboxList)

  const bookingFormContextValues = {
    patientForm, setPatientForm,
    patientErrorForm, setPatientErrorForm,
    patientFormCheckbox, setPatientFormCheckbox
  }

  const renderContent = () => {
    return (
      <>
        {session && (
          <main className={styles.main}>
            <Steps 
              ref={stepsRef}
              steps={steps}
              setSteps={setSteps}
              currentStep={currentStep}
              setCurrentStep={setCurrentStep}
              currentStepIndex={currentStepIndex}
              setCurrentStepIndex={setCurrentStepIndex}
              onStepNext={onStepNext}
            />
            <section className={styles.component}>
              <BookingFormContext.Provider value={bookingFormContextValues}>
                {currentStep && currentStep.component && <currentStep.component />}
              </BookingFormContext.Provider>
            </section>
          </main>
        )}
      </>
    )
  }

  return (
    <>
      {(status !== 'loading' && session) && (
          session.user?.role === 'patient' ? (
            <PatientLayout>
              {renderContent()}
            </PatientLayout>
          ) : (
            <DentistLayout>
              {renderContent()}
            </DentistLayout>
          )
        )
      }
    </>
  )
}
