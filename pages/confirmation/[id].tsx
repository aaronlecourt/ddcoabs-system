import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../../styles/pages/confirmation.module.scss'
import DentistLayout from '../../layouts/DentistLayout';
import useAuthGuard from '../../guards/auth.guard';
import Button from '../../components/Button';

export default function Confirmation() {
  const { session, status } = useAuthGuard();
  const router = useRouter();

  const [appointment, setAppointment] = useState({
    patientId: '',
    patientName: '',
    timeUnit: '',
    dentistService: '',
    concern: '',
    price: '',
    date: '',
    paymentMethod: ''
  })

  const [startTime, setStartTime] = useState('09:00')
  const [endTime, setEndTime] = useState('11:00')

  const formattedDate = (new Date(appointment.date)).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  useEffect(() => {
    const getAppointmentDetails = async () => {
      const { id } = router.query;
      console.log('Appointment ID: ', id);
  
      const response = await fetch(`http://localhost:3000/api/global/appointment/${router.query.id}`);
      const appointment = await response.json();

      if (appointment.patientId) {
        const response = await fetch(`http://localhost:3000/api/global/user/${appointment.patientId}`);
        const patient = await response.json();
        console.log('patient ', patient)
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

      console.log('confirm appointment ', appointment)
      setAppointment(appointment)      
    }
    // Get Appointment Details Here then populate the details
    getAppointmentDetails()

  }, [router.query])

  const confirmBooking = () => {
    const { id } = router.query;

    const user = session.user

    if (user) {
      fetch(`/api/${user.role}/appointment/confirm/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(Object.assign(appointment, {
          dentistId: user.id,
          patientId: appointment.patientId,
          startTime: Number((startTime || '0').replace(/^0+/, "").replace(/:00/, '')),
          endTime: Number((endTime || '0').replace(/^0+/, "").replace(/:00/, ''))
        })),
      })
        .then(async (response) => {
          const responseMsg = await response.json()
          console.log('appointment confirmation response msg ', JSON.stringify(responseMsg))
          if (!response.ok) {
            alert('appointment confirmation failed: ' + JSON.stringify(responseMsg))
          } else {
            alert('Appointment Confirmation Successful')
            window.location.href = '/'
          }
        })
        .catch(error => {
          alert('Appointment Confirmation Failed');
          console.error('Error updating data:', error);
        });  
    }
  }

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
                    <span>P {appointment.price || '500.00'}</span>
                  </div>
                  <div className={styles.bookingDetails__row}>
                    <strong>Date:</strong>
                    <span>{formattedDate}</span>
                  </div>
                  <div className={styles.bookingDetails__row}>
                    <strong>Payment Method:</strong>
                    <span>{appointment.paymentMethod}</span>
                  </div>
                </div>
              </div>
              <div className={styles.container__row}>
                <strong>Patient Concern</strong>
                <p className={styles.subtitle}>{appointment.concern}</p>
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
                <Button style={{ display: 'inline-block' }} onClick={confirmBooking}>Confirm</Button>
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
