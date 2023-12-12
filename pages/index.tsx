import { useState } from 'react';
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

export default function Home() {
  const { session, status } = useAuthGuard();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      service: 'Brace Adjustment',
      status: 'Confirmed'
    },
    {
      id: 2,
      service: 'Cleaning',
      status: 'Pending'
    },
    {
      id: 3,
      service: 'Tooth Extraction',
      status: 'Pending'
    },
  ])
  const [showCancelAppointment, setShowCancelAppointment] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState(null)

  const onCancelAppointment = (appointment: any) => {
    setSelectedAppointment(appointment);
    setShowCancelAppointment(true);
  }

  const cancelAppointment = () => {
    console.log(selectedAppointment);
    alert('API CALL HERE CANCEL APPOINTMENT');
  }

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
        <Modal open={showCancelAppointment} setOpen={setShowCancelAppointment} modalWidth={400} modalRadius={10}>
          <h3 className={styles.cancelTitle}>Cancel Appointment</h3>
          <div className={styles.cancelText}>
            <FontAwesomeIcon icon={faCancel} size="3x" color={'#F01900'} />
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
                  {appointments.map((appointment, index) =>
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
