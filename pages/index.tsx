import { useState } from 'react';
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'
import connectMongo from '../utils/connectMongo';
import { getSession } from "next-auth/react"
import styles from '../styles/pages/home.module.scss'
import PatientLayout from '../layouts/PatientLayout';
import DentistLayout from '../layouts/DentistLayout';
import useAuthGuard from '../guards/auth.guard';
import CustomCalendar from '../components/CustomCalendar';
import Appointment from '../components/Appointment';
import Modal from '../components/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCancel } from '@fortawesome/free-solid-svg-icons';
import Button from '../components/Button';
import Image from 'next/image';
import { useRouter } from 'next/router';

export const getServerSideProps: GetServerSideProps<any> = async (context) => {
  const session = await getSession(context);

  try {
    await connectMongo();

    if (!session) {
      return {
        props: { isConnected: false },
      }
    }

    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/global/appointment`);
    const data = await response.json();
    console.log('appointments data ', data)

    return {
      props: { isConnected: true, initialAppointmentData: data || [] },
    }

  } catch (e) {
    console.error(e)
    return {
      props: { isConnected: false },
    }
  }
}

export default function Home({
  isConnected,
  initialAppointmentData
}: InferGetServerSidePropsType<typeof getServerSideProps>) {

  console.log(' ehhehehe ', initialAppointmentData)
  const { session, status } = useAuthGuard();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState(initialAppointmentData)
  const [showCancelAppointment, setShowCancelAppointment] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null)

  const onCancelAppointment = (appointment: any) => {
    setSelectedAppointment(appointment);
    setShowCancelAppointment(true);
  }

  const cancelAppointment = () => {
    const user = session.user

    if (user) {
      fetch(`/api/${user.role}/appointment/cancel/${selectedAppointment._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: '',
      })
        .then(async (response) => {
          const responseMsg = await response.json()
          if (!response.ok) {
            alert('appointment cancel failed: ' + responseMsg)
          } else {
            alert('Appointment Cancel Successful')
            window.location.href = '/'
          }
        })
        .catch(error => {
          alert('Appointment Cancel Failed');
          console.error('Error updating data:', error);
        });  
    }
  }

  const renderContent = () => {
    return (
      <>
        {session && (
          <main className={`${styles.main} ${styles.mainLandingPage}`}>
            <Image
              src='/logo.png'
              alt='logo'
              width={500}
              height={150}
            />
            <h1>Landing Page</h1>
          </main>
        )}
      </>
    )
  }

  const renderDentistContent = () => {
    return (
      <>
        <Modal open={showCancelAppointment} setOpen={setShowCancelAppointment} modalWidth={400} modalRadius={10}>
          <h3 className={styles.cancelTitle}>Cancel Appointment</h3>
          <div className={styles.cancelText}>
            <div style={{ width: '54px', height: '54px' }}>
              <FontAwesomeIcon icon={faCancel} size="3x" width={54} height={54} color={'#F01900'} />
            </div>
            <p>Please confirm the cancellation of this appointment.
              This action is not irreversible.</p>
          </div>
          <div className={styles.cancelActions}>
            <Button type='secondary' onClick={() => setShowCancelAppointment(false)}>No</Button>
            <Button onClick={cancelAppointment}>Yes</Button>
          </div>
        </Modal>
        {session && (
          <main className={styles.main}>
            <h1 className={styles.title}>Hello {session.user?.name}!</h1>
            <div className={styles.container}>
              <section>
                <div className={styles.appointments}>
                  {appointments.map((appointment: any, index: number) =>
                    <Appointment key={index} appointment={appointment} onCancelAppointment={onCancelAppointment} />
                  )}
                </div>
              </section>
              <section>
                <CustomCalendar
                  selectable={false}
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
                />
              </section>
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
            {renderDentistContent()}
          </DentistLayout>
        )
      )
      }
    </>
  )
}
