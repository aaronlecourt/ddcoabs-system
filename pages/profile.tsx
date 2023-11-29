import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useSession } from "next-auth/react"
import styles from '../styles/pages/profile.module.scss'
import PatientLayout from '../layouts/PatientLayout';
import DentistLayout from '../layouts/DentistLayout';

export default function Profile() {
  const { data: session, status }: any = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      router.push('/login');
    }
  }, [session, status, router]); 

  const renderContent = () => {
    return (
      <>
        {session && (
          <main className={styles.main}>
            <h1 className={styles.title}>Hello {session.user?.email}!</h1>
            <p className={styles.subtitle}>You can edit your profile information, change your password, and update your patient record here.</p>
            <div className={styles.information}>
              <div className={styles.information__title}>Patient Information Record</div>
            </div>
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
