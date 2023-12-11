import styles from '../styles/pages/book.module.scss'
import PatientLayout from '../layouts/PatientLayout';
import DentistLayout from '../layouts/DentistLayout';
import useAuthGuard from '../guards/auth.guard';
import Steps from '../components/Steps';
import { useRef, useState, forwardRef, createContext, useEffect } from 'react';
import { BookPatientForm, BookServicesForm, BookScheduleForm } from '../forms';
import { PatientErrorFormData, PatientFormCheckbox, PatientFormData } from '../types/book';
import { ErrorPatientFormObject, PatientFormCheckboxList, PatientFormObject } from '../forms/patient';
import { servicesCollection } from '../forms/services';

export const BookingFormContext = createContext({})

export default function Book() {
  const { session, status } = useAuthGuard();
  const [currentStepIndex, setCurrentStepIndex] = useState(0)

  const stepsRef = useRef(null)
  const formRef = useRef(null)

  const onStepNext = (e: any, index?: number) => {
    e.preventDefault()

    let stepValid = false;

    if (formRef.current) {
      const { checkValidForm }: { checkValidForm: () => boolean } = formRef.current;
      stepValid = checkValidForm()
    }

    if ((stepValid || (index !== undefined && index < currentStepIndex)) && stepsRef.current) {
      const { setActiveStep }: { setActiveStep: (e: any, index: number) => void } = stepsRef.current;

      if (index === undefined || 
        (index !== undefined && index == currentStepIndex + 1) ||
        (index !== undefined && index < currentStepIndex )
      ){
        setActiveStep(e, index !== undefined ? index : currentStepIndex + 1)
      }
    }
  }

  const onStepBack = (e: any) => {
    e.preventDefault()

    if (stepsRef.current) {
      const { setActiveStep }: { setActiveStep: (e: any, index: number) => void } = stepsRef.current;
      setActiveStep(e, currentStepIndex - 1)
    }
  }

  const [steps, setSteps] = useState<any>([
    {
      label: 'Patient Form',
      active: true,
      component: () => <BookPatientForm ref={formRef} />,
      current: true
    },
    {
      label: 'Services',
      active: false,
      component: () => <BookServicesForm ref={formRef} />,
      current: false
    },
    {
      label: 'Date & Time',
      active: false,
      component: () => <BookScheduleForm ref={formRef} />,
      current: false
    },
    {
      label: 'Payment',
      active: false,
      component: () => <BookServicesForm ref={formRef} />,
      current: false
    },
    {
      label: 'Confirmation',
      active: false,
      component: () => <BookServicesForm ref={formRef} />,
      current: false
    }
  ])
  const [currentStep, setCurrentStep] = useState(steps[currentStepIndex])
  const [patientForm, setPatientForm] = useState<PatientFormData>(PatientFormObject)
  const [patientErrorForm, setPatientErrorForm] = useState<PatientErrorFormData>(ErrorPatientFormObject)
  const [patientFormCheckbox, setPatientFormCheckbox] = useState<Array<PatientFormCheckbox[]>>(PatientFormCheckboxList)
  const [services, setServices] = useState(servicesCollection);

  const bookingFormContextValues = {
    patientForm, setPatientForm,
    patientErrorForm, setPatientErrorForm,
    patientFormCheckbox, setPatientFormCheckbox,
    services, setServices,
    onStepNext, onStepBack
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
