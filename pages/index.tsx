import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useSession } from "next-auth/react"
import styles from '../styles/pages/home.module.scss'
import PatientLayout from '../layouts/PatientLayout';
import DentistLayout from '../layouts/DentistLayout';


export default function Home() {
  const { data: session, status }: any = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      router.push('/login');
    } else {
      // TODO: Check User if profile is completed, if not, redirect to /profile
    }

  }, [session, status, router]);

  const renderContent = () => {
    return (
      <>
        {session && (
          <main className={styles.main}>
            <h1>DENTALFIX DENTAL CLINIC!</h1>
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
