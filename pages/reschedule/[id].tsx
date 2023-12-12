import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../../styles/pages/reschedule.module.scss'
import DentistLayout from '../../layouts/DentistLayout';
import useAuthGuard from '../../guards/auth.guard';
import Button from '../../components/Button';
import CustomCalendar from '../../components/CustomCalendar';

export default function Reschedule() {
  const { session, status } = useAuthGuard();
  const router = useRouter();

  const [startTime, setStartTime] = useState('09:00')
  const [endTime, setEndTime] = useState('11:00')
  const [reschedDate, setReschedDate] = useState(new Date())

  useEffect(() => {
    if (session && session.user.role == 'patient') {
      router.replace('/');
    }
  }, [session])

  useEffect(() => {
    const { id } = router.query;
    console.log('Appointment ID: ', id);
    // Get Appointment Details Here then populate the details
  }, [router.query])

  const submit = () => {
    console.log(startTime)
    console.log(endTime)
    alert('API CALL HERE SUBMIT RESCHEDULE')
  }

  const renderContent = () => {
    return (
      <>
        {session && (
          <main className={styles.main}>
            <h1 className={styles.title}>Reschedule</h1>
            <p className={styles.subtitle}>Reschedule the appointment by selecting a different start time and/or date.</p>
            <div className={styles.container}>
              <div className={styles.container__row}>
                <strong>Select Date</strong>
                <div style={{ marginTop: '.5rem' }}>
                  <CustomCalendar 
                    selectedDate={reschedDate}
                    setSelectedDate={setReschedDate}
                  />
                </div>
              </div>
              <div className={styles.container__row}>
                <strong>Booking Details</strong>
                <div className={styles.bookingDetails}>
                  <div className={styles.bookingDetails__row}>
                    <strong>Patient Name:</strong>
                    <span>Maria Torres</span>
                  </div>
                  <div className={styles.bookingDetails__row}>
                    <strong>Time:</strong>
                    <span>AM</span>
                  </div>
                  <div className={styles.bookingDetails__row}>
                    <strong>Service:</strong>
                    <span>Consultation</span>
                  </div>
                  <div className={styles.bookingDetails__row}>
                    <strong>Price:</strong>
                    <span>500</span>
                  </div>
                  <div className={styles.bookingDetails__row}>
                    <strong>Date:</strong>
                    <span>November 21, 2023</span>
                  </div>
                  <div className={styles.bookingDetails__row}>
                    <strong>Payment Method:</strong>
                    <span>Pay in cash</span>
                  </div>
                </div>
                <div className={styles.container__action}>
                  <Button style={{ display: 'inline-block' }} onClick={submit}>Submit Changes</Button>
                </div>
              </div>
              <div className={styles.container__row}>
                <strong>Select Time</strong>
                <div className={styles.timeContainer}>
                  <div className={styles.timePicker}>
                    <strong className={styles.timePicker__label}>Start</strong>
                    <div className={styles.timePicker__input}>
                      <input type='time' value={startTime} onChange={e => setStartTime(e.target.value)} />
                    </div>
                  </div>
                  <div className={styles.timePicker}>
                    <strong className={styles.timePicker__label}>End</strong>
                    <div className={styles.timePicker__input}>
                      <input type='time' value={endTime} onChange={e => setEndTime(e.target.value)} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        )}
      </>
    )
  }

  return (
    <>
      {(status !== 'loading' && session) && (
        <DentistLayout>
          {renderContent()}
        </DentistLayout>
      )
      }
    </>
  )
}
