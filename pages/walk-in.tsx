import styles from '../styles/pages/book.module.scss'
import DentistLayout from '../layouts/DentistLayout';
import useAuthGuard from '../guards/auth.guard';
import Steps from '../components/Steps';
import { useRef, useState, createContext, useEffect } from 'react';
import {
  BookWalkInServicesForm,
  BookWalkInScheduleForm,
  BookWalkInPaymentForm,
  BookWalkInConfirmationForm,
  BookWalkInForm,
} from '../forms';
import { ServicesErrorFormData, ServicesFormData,  PatientErrorFormDataDentist, PatientFormDataDentist  } from '../types/book';
import { ErrorPatientFormObjectDentist, PatientWalkIn } from '../forms/walk-in';
import { ErrorServicesFormObject, ServicesFormObject } from '../forms/services';

export const BookingFormContextDentist = createContext({})

export default function Book() {
  const { session, status } = useAuthGuard();

  const [currentStepIndex, setCurrentStepIndex] = useState(0)

  const stepsRef = useRef(null)
  const formRef = useRef(null)

  const onStepNext = async (e: any, index?: number) => {
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
        (index !== undefined && index < currentStepIndex)
      ) {
        setActiveStep(e, index !== undefined ? index : currentStepIndex + 1)
      }
    }
  }

  useEffect(() => {

    const setServicesData = async () => {
      let response = await fetch('api/dentist/dentist-service');
      let data = await response.json() || [];
      console.log('data ', response)

      data = data.map((v: any) => {
        v.selected = false
        return v
      })

      setServices(data)
    }

    if (currentStepIndex == 1 && services.length == 0) setServicesData()
  }, [ currentStepIndex ])

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
      component: () => <BookWalkInForm ref={formRef} />,
      current: true
    },
    {
      label: 'Services',
      active: false,
      component: () => <BookWalkInServicesForm ref={formRef} />,
      current: false
    },
    {
      label: 'Date & Time',
      active: false,
      component: () => <BookWalkInScheduleForm ref={formRef} />,
      current: false
    },
    {
      label: 'Payment',
      active: false,
      component: () => <BookWalkInPaymentForm ref={formRef} />,
      current: false
    },
    {
      label: 'Confirmation',
      active: false,
      component: () => <BookWalkInConfirmationForm ref={formRef} />,
      current: false
    }
  ])

  const [currentStep, setCurrentStep] = useState(steps[currentStepIndex])

  // FOR DENTIST
  const [patientFormDentist, setPatientFormDentist] = useState<PatientFormDataDentist>(PatientWalkIn)
  const [patientErrorFormDataDentist, setPatientErrorFormDentist] = useState<PatientErrorFormDataDentist>(ErrorPatientFormObjectDentist)

  // FOR SERCVICES
  const [servicesForm, setServicesForm] = useState<ServicesFormData>(ServicesFormObject);
  const [servicesErrorForm, setServicesErrorForm] = useState<ServicesErrorFormData>(ErrorServicesFormObject);
  const [services, setServices] = useState([]);

  // FOR DATE N TIME
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedStartTime, setSelectedStartTime] = useState(8);
  const [selectedEndTime, setSelectedEndTime] = useState(17);
  const [selectedTimeUnit, setSelectedTimeUnit] = useState('AM');

  // FOR PAYMENT FORM
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('Pay in Cash');

    const bookingFormContextValuesDentist = {
    patientFormDentist, setPatientFormDentist,
    patientErrorFormDataDentist, setPatientErrorFormDentist,
    servicesForm, setServicesForm,
    servicesErrorForm, setServicesErrorForm,
    services, setServices,
    selectedDate, setSelectedDate,
    selectedStartTime, setSelectedStartTime,
    selectedEndTime, setSelectedEndTime,
    selectedTimeUnit, setSelectedTimeUnit,
    selectedPaymentMethod, setSelectedPaymentMethod,
    onStepNext, onStepBack,
  }

  const renderContent = () => {

    return (
      <>
        <main className={styles.main}>
          {session && (
            <>
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
                <BookingFormContextDentist.Provider value={bookingFormContextValuesDentist}>
                {currentStep && currentStep.component && (
                    <currentStep.component ref={formRef} />
                )}
                </BookingFormContextDentist.Provider>
              </section>
            </>
          )}
        </main>
      </>
    )
  }

  return (
    <>
        <DentistLayout>
            {renderContent()}
        </DentistLayout>
</>
  )
}
