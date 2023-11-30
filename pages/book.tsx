import styles from '../styles/pages/home.module.scss'
import PatientLayout from '../layouts/PatientLayout';
import DentistLayout from '../layouts/DentistLayout';
import useAuthGuard from '../guards/auth.guard';
import Steps from '../components/Steps';
import { useState } from 'react';


export default function Book() {
  const { session, status } = useAuthGuard();
  const [steps, setSteps] = useState([
    {
      label: 'Patient Form',
      active: true
    },
    {
      label: 'Services',
      active: false
    },
    {
      label: 'Date & Time',
      active: false
    },
    {
      label: 'Payment',
      active: false
    },
    {
      label: 'Confirmation',
      active: false
    }
  ])

  const renderContent = () => {
    return (
      <>
        {session && (
          <main className={styles.main}>
            <Steps 
              steps={steps}
              setSteps={setSteps}
              width={500}
            />
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
