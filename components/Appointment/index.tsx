import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styles from './style.module.scss'
import { faCalendar, faCancel, faChevronDown, faChevronRight, faClock, faPencil, faUser, faWallet } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react';

export default function Appointment({ appointment, onCancelAppointment }: any) {
  const [collapse, setCollapse] = useState(true);

  const openAppointment = (e: any) => {
    e.preventDefault();
    setCollapse(!collapse)
  }

  const reschedule = () => {
    window.location.href = `/reschedule/${appointment.id}`;
  }

  const cancel = () => {
    onCancelAppointment(appointment);
  }

  const confirm = () => {
    window.location.href = `/confirmation/${appointment.id}`;
  }

  return (
    <div className={styles.appointments__itemContainer}>
      <div className={styles.appointments__item} onClick={openAppointment}>
        <div className={styles.appointments__title}>{appointment.service}</div>
        <div className={styles.appointments__user}>
          <FontAwesomeIcon icon={faUser} width={15} height={15} color={'#3AB286'} />
          <span>Maria Torres</span>
        </div>
        <div className={styles.appointments__statusContainer}>
          <div className={`${styles.appointments__status} ${appointment.status == 'Confirmed' ? styles.appointments__statusConfirmed : styles.appointments__statusPending}`}>{appointment.status}</div>
          <FontAwesomeIcon icon={!collapse ? faChevronDown : faChevronRight} width={15} height={16} color={'#737373'} />
        </div>
      </div>
      {!collapse && <div className={styles.appointments__details}>
        <div className={styles.appointments__details__row}>
          <div className={styles.appointments__details__rowItem}>
            <FontAwesomeIcon icon={faCalendar} color={'#3AB286'} width={15} />
            <span>March 20, 2023</span>
          </div>
          <div className={styles.appointments__details__rowItem}>
            <FontAwesomeIcon icon={faClock} color={'#3AB286'} width={15} />
            <span>1:00pm-2:00pm</span>
          </div>
          <div className={styles.appointments__details__rowItem}>
            <FontAwesomeIcon icon={faWallet} color={'#3AB286'} width={15} />
            <span>Pay in cash</span>
          </div>
        </div>
        {appointment.status == 'Pending' &&
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