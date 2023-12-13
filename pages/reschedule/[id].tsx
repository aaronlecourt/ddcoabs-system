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
  const [appointment, setAppointment] = useState<any>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const { id }: any = router.query;
    console.log('Appointment ID: ', id);

    const getAppointment = async (id: any) => {
      let response = await fetch(`/api/global/appointment/${id}`);

      if (!response.ok) {
        setLoading(false);
      }

      let appointment = await response.json() || [];

      if (appointment.patientId) {
        const response = await fetch(`/api/global/user/${appointment.patientId}`);
        const patient = await response.json();
        Object.assign(appointment, { patientName: patient.name })
      }

      if (!appointment.startTime && !appointment.endTime && appointment.timeUnit == 'PM') {
        setStartTime('13:00')
        setEndTime('15:00')
      }

      if (appointment.startTime && appointment.endTime) {
        setStartTime(`${appointment.startTime < 10 ? '0'+appointment.startTime: appointment.startTime}:00`)
        setEndTime(`${appointment.endTime}:00`)
      }

      setReschedDate(appointment.date);
      setAppointment(appointment)      
      setLoading(false);
    }

    if (id) {
      getAppointment(id);
    }

  }, [router.query])

  const submit = () => {
    const user = session.user

    if (user) {
      const { id }: any = router.query;
      fetch(`/api/${user.role}/appointment/resched/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(Object.assign(appointment, {
          dentistId: user.id,
          patientId: appointment.patientId,
          date: reschedDate,
          startTime: Number((startTime || '0').replace(/^0+/, "").replace(/:00/, '')),
          endTime: Number((endTime || '0').replace(/^0+/, "").replace(/:00/, ''))
        })),
      })
        .then(async (response) => {
          const responseMsg = await response.json()
          if (!response.ok) {
            alert('appointment reschedule failed: ' + JSON.stringify(responseMsg))
          } else {
            alert('appointment Reschedule Successful')
            window.location.href = '/'
          }
        })
        .catch(error => {
          alert('appointment reschedule failed');
          console.error('Error updating data:', error);
        });  
    }
  }

  const renderContent = () => {
    return (
      <>
        {session && (
          <main className={styles.main}>
            <h1 className={styles.title}>Reschedule</h1>
            <p className={styles.subtitle}>Reschedule the appointment by selecting a different start time and/or date.</p>
            {loading && <div>Loading...</div>}
            {!loading &&<div className={styles.container}>
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
                    <span>{appointment.patientName}</span>
                  </div>
                  <div className={styles.bookingDetails__row}>
                    <strong>Time:</strong>
                    <span>{appointment.timeUnit}</span>
                  </div>
                  <div className={styles.bookingDetails__row}>
                    <strong>Service:</strong>
                    <span>{appointment.dentistService || 'Consultation'}</span>
                  </div>
                  <div className={styles.bookingDetails__row}>
                    <strong>Price:</strong>
                    <span>{appointment.price ? appointment.price.toFixed(2) : '500.00'}</span>
                  </div>
                  <div className={styles.bookingDetails__row}>
                    <strong>Date:</strong>
                    <span>{new Date(appointment.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <div className={styles.bookingDetails__row}>
                    <strong>Payment Method:</strong>
                    <span>{appointment.paymentMethod}</span>
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
            </div>}
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
