import styles from '../styles/pages/book.module.scss'
import PatientLayout from '../layouts/PatientLayout';
import DentistLayout from '../layouts/DentistLayout';
import useAuthGuard from '../guards/auth.guard';
import Steps from '../components/Steps';
import { useState } from 'react';
import { BookPatientForm } from '../forms';


export default function Book() {
  const { session, status } = useAuthGuard();
  const [steps, setSteps] = useState([
    {
      label: 'Patient Form',
      active: true,
      component: BookPatientForm
    },
    {
      label: 'Services',
      active: false,
      component: () => <></>
    },
    {
      label: 'Date & Time',
      active: false,
      component: () => <></>
    },
    {
      label: 'Payment',
      active: false,
      component: () => <></>
    },
    {
      label: 'Confirmation',
      active: false,
      component: () => <></>
    }
  ])
  const [currentStep, setCurrentStep] = useState(steps[0])

  const renderContent = () => {
    return (
      <>
        {session && (
          <main className={styles.main}>
            <Steps 
              steps={steps}
              setSteps={setSteps}
              setCurrentStep={setCurrentStep}
            />
            <section className={styles.component}>
              {currentStep.component && <currentStep.component />}
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
