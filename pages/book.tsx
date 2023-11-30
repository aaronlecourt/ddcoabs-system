import styles from '../styles/pages/home.module.scss'
import PatientLayout from '../layouts/PatientLayout';
import DentistLayout from '../layouts/DentistLayout';
import useAuthGuard from '../guards/auth.guard';


export default function Book() {
  const { session, status } = useAuthGuard();

  const renderContent = () => {
    return (
      <>
        {session && (
          <main className={styles.main}>
            <h1>DENTALFIX DENTAL CLINIC BOOKING PAGE!</h1>
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
