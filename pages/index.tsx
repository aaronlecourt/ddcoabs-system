import { useState } from 'react';
import styles from '../styles/pages/home.module.scss'
import PatientLayout from '../layouts/PatientLayout';
import DentistLayout from '../layouts/DentistLayout';
import useAuthGuard from '../guards/auth.guard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import CustomCalendar from '../components/CustomCalendar';
import Appointment from '../components/Appointment';

export default function Home() {
  const { session, status } = useAuthGuard();

  const [selectedDate, setSelectedDate] = useState(new Date());

  const [appointments, setAppointments] = useState([
    {
      service: 'Brace Adjustment',
      status: 'Confirmed'
    },
    {
      service: 'Cleaning',
      status: 'Pending'
    },
    {
      service: 'Tooth Extraction',
      status: 'Pending'
    },
  ])

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

  const renderDentistContent = () => {
    return (
      <>
        {session && (
          <main className={styles.main}>
            <h1 className={styles.title}>Hello {session.user?.name}!</h1>
            <div className={styles.container}>
              <section>
                <div className={styles.appointments}>
                  {appointments.map((appointment, index) => 
                    <Appointment key={index} appointment={appointment} />
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
