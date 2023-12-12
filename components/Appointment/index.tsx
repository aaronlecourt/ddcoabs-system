import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styles from './style.module.scss'
import { faCalendar, faCancel, faChevronDown, faChevronRight, faClock, faPencil, faUser, faWallet } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react';
import APPOINTMENT_STATUS from "../../constants/appointmentStatus";
import { useRouter } from 'next/router';

export default function Appointment({ appointment, onCancelAppointment }: any) {
  const [collapse, setCollapse] = useState(true);

  const openAppointment = (e: any) => {
    e.preventDefault();
    setCollapse(!collapse)
  }

  const reschedule = () => {
    window.location.href = `/reschedule/${appointment._id}`;
  }

  const cancel = () => {
    onCancelAppointment(appointment);
  }

  const confirm = () => {
    window.location.href= `/confirmation/${appointment._id}`;
  }

  const formattedDate = (appointmentDate: Date) => {
    return appointmentDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) 
  }

  const formattedTime = (appointment: any) => {
    const { status, startTime, endTime } = appointment;
    let { timeUnit } = appointment
    timeUnit = timeUnit.toLowerCase()
    return status == APPOINTMENT_STATUS.pending || (!startTime && !endTime)
      ? timeUnit.toUpperCase()
      : timeUnit == 'am'
      ? `${startTime}:00${timeUnit}-${endTime}:00${endTime == 12 ? 'pm' : 'am'}`
      : `${startTime == 12 ? 12 : startTime - 12}:00${timeUnit}-${endTime - 12}:00${timeUnit}` 
  }

  return (
    <div className={styles.appointments__itemContainer}>
      <div className={styles.appointments__item} onClick={openAppointment}>
        <div className={styles.appointments__title}>{appointment.dentistService || 'Consultation'}</div>
        <div className={styles.appointments__user}>
          <FontAwesomeIcon icon={faUser} width={15} height={15} color={'#3AB286'} />
          <span>Maria Torres</span>
        </div>
        <div className={styles.appointments__statusContainer}>
          <div className={`${styles.appointments__status} ${appointment.status == APPOINTMENT_STATUS.confirmed ? styles.appointments__statusConfirmed : styles.appointments__statusPending}`}>{appointment.status}</div>
          <FontAwesomeIcon icon={!collapse ? faChevronDown : faChevronRight} width={15} height={16} color={'#737373'} />
        </div>
      </div>
      {!collapse && <div className={styles.appointments__details}>
        <div className={styles.appointments__details__row}>
          <div className={styles.appointments__details__rowItem}>
            <FontAwesomeIcon icon={faCalendar} color={'#3AB286'} width={15}/>
            <span>{formattedDate(new Date(appointment.date))}</span>
          </div>
          <div className={styles.appointments__details__rowItem}>
            <FontAwesomeIcon icon={faClock} color={'#3AB286'} width={15}/>
            <span>{formattedTime(appointment)}</span>
          </div>
          <div className={styles.appointments__details__rowItem}>
            <FontAwesomeIcon icon={faWallet} color={'#3AB286'} width={15}/>
            <span>{appointment.paymentMethod}</span>
          </div>
        </div>
        {appointment.status == APPOINTMENT_STATUS.pending && 
          <>
            <div className={styles.appointments__details__separator}></div>
            <div className={styles.appointments__details__row}>
              <div className={`${styles.appointments__details__rowItem} ${styles.appointments__details__rowItemClickable}`} onClick={reschedule}>
                <FontAwesomeIcon icon={faPencil} color={'#FFE72E'} width={15} />
                <span>Reschedule</span>
              </div>
              <div className={`${styles.appointments__details__rowItem} ${styles.appointments__details__rowItemClickable}`} onClick={cancel}>
                <FontAwesomeIcon icon={faCancel} color={'#F01900'} width={15} />
                <span>Cancel</span>
              </div>
              <div className={`${styles.appointments__details__rowItem} ${styles.appointments__details__rowItemClickable}`} onClick={confirm}>
                <div className={styles.mainAction}>CONFIRM</div>
              </div>
            </div>
          </>
        }
      </div>
      }
    </div>
  )
}