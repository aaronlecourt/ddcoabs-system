import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/pages/confirmation.module.scss'
import DentistLayout from '../layouts/DentistLayout';
import useAuthGuard from '../guards/auth.guard';
import Button from '../components/Button';

export default function Confirmation() {
  const { session, status } = useAuthGuard();
  const router = useRouter();

  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')

  useEffect(() => {
    if (session && session.user.role == 'patient') {
      router.replace('/');
    }
  }, [session])

  const renderContent = () => {
    return (
      <>
        {session && (
          <main className={styles.main}>
            <h1 className={styles.title}>Confirmation</h1>
            <p className={styles.subtitle}>Please confirm the appointment</p>
            <div className={styles.container}>
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
              </div>
              <div className={styles.container__row}>
                <strong>Patient Concern</strong>
                <p className={styles.subtitle}>My tooth on the back part hurts so much.</p>
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
              <div className={styles.container__row}>
                <Button style={{ display: 'inline-block' }}>Confirm</Button>
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
