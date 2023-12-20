import styles from '../styles/pages/book.module.scss'
import PatientLayout from '../layouts/PatientLayout';
import DentistLayout from '../layouts/DentistLayout';
import useAuthGuard from '../guards/auth.guard';
import Steps from '../components/Steps';
import { useRef, useState, createContext, useEffect } from 'react';
import {
  BookPatientForm,
  BookServicesForm,
  BookScheduleForm,
  BookPaymentForm,
  BookConfirmationForm,
  BookWalkInForm,
} from '../forms';
import { PatientErrorFormData, PatientFormCheckbox, PatientFormData, ServicesErrorFormData, ServicesFormData } from '../types/book';
import { PatientErrorFormDataDentist, PatientFormDataDentist} from '../types/emergencyBook';
import { ErrorPatientFormObject, PatientFormCheckboxList, PatientFormObject } from '../forms/patient';
import { ErrorPatientFormObjectDentist, PatientWalkIn } from '../forms/walk-in';
import { ErrorServicesFormObject, ServicesFormObject } from '../forms/services';

export const BookingFormContext = createContext({})


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
      component: () => <BookPaymentForm ref={formRef} />,
      current: false
    },
    {
      label: 'Confirmation',
      active: false,
      component: () => <BookConfirmationForm ref={formRef} />,
      current: false
    }
  ])

  useEffect(() => {
    if (session?.user?.role === 'dentist') {
      setSteps((prevSteps: any) => {
        const updatedSteps = [...prevSteps];
        const patientFormStepIndex = updatedSteps.findIndex(step => step.label === 'Patient Form');
        if (patientFormStepIndex !== -1) {
          updatedSteps[patientFormStepIndex].component = () => <BookWalkInForm ref={formRef} />;
        }
        return updatedSteps;
      });
    }
  }, [session?.user?.role]);

  const [currentStep, setCurrentStep] = useState(steps[currentStepIndex])
  const [patientFormDentist, setPatientFormDentist] = useState<PatientFormDataDentist>(PatientWalkIn)
  const [patientForm, setPatientForm] = useState<PatientFormData>(PatientFormObject)
  const [patientErrorFormDataDentist, setPatientErrorFormDentist] = useState<PatientErrorFormDataDentist>(ErrorPatientFormObjectDentist)
  const [patientErrorForm, setPatientErrorForm] = useState<PatientErrorFormData>(ErrorPatientFormObject)
  const [patientFormCheckbox, setPatientFormCheckbox] = useState<Array<PatientFormCheckbox[]>>(PatientFormCheckboxList)
  const [servicesForm, setServicesForm] = useState<ServicesFormData>(ServicesFormObject);
  const [servicesErrorForm, setServicesErrorForm] = useState<ServicesErrorFormData>(ErrorServicesFormObject);
  const [services, setServices] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTimeUnit, setSelectedTimeUnit] = useState('AM');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('Pay in Cash');

  const bookingFormContextValues = {
    patientForm, setPatientForm,
    patientErrorForm, setPatientErrorForm,
    patientFormCheckbox, setPatientFormCheckbox,
    servicesForm, setServicesForm,
    servicesErrorForm, setServicesErrorForm,
    services, setServices,
    selectedDate, setSelectedDate,
    selectedTimeUnit, setSelectedTimeUnit,
    selectedPaymentMethod, setSelectedPaymentMethod,
    onStepNext, onStepBack,

    patientFormDentist, setPatientFormDentist,
    patientErrorFormDataDentist, setPatientErrorFormDentist
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
