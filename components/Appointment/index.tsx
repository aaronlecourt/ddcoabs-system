import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styles from './style.module.scss'
import { faCalendar, faCancel, faChevronRight, faClock, faPencil, faUser, faUserAlt, faWallet } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Appointment({ appointment }: any) {
  const [collapse, setCollapse] = useState(true);

  const openAppointment = (e: any) => {
    e.preventDefault();
    setCollapse(!collapse)
  }

  const reschedule = () => {
    alert('Reschedule');
  }

  const cancel = () => {
    alert('Cancel');
  }

  const confirm = () => {
    if (appointment.status == 'Pending') {
      window.location.href= '/confirmation'
    } else {
      // Done
    }
  }

  return (
    <div className={styles.appointments__itemContainer}>
      <div className={styles.appointments__item} onClick={openAppointment}>
        <div className={styles.appointments__title}>{appointment.service}</div>
        <div className={styles.appointments__user}>
          <FontAwesomeIcon icon={faUser} width={15} color={'#3AB286'} />
          <span>Maria Torres</span>
        </div>
        <div className={styles.appointments__statusContainer}>
          <div className={`${styles.appointments__status} ${appointment.status == 'Confirmed' ? styles.appointments__statusConfirmed : styles.appointments__statusPending}`}>{appointment.status}</div>
          <FontAwesomeIcon icon={faChevronRight} width={15} color={'#737373'} />
        </div>
      </div>
      {!collapse && <div className={styles.appointments__details}>
        <div className={styles.appointments__details__row}>
          <div className={styles.appointments__details__rowItem}>
            <FontAwesomeIcon icon={faCalendar} color={'#3AB286'} />
            <span>March 20, 2023</span>
          </div>
          <div className={styles.appointments__details__rowItem}>
            <FontAwesomeIcon icon={faClock} color={'#3AB286'} />
            <span>1:00pm-2:00pm</span>
          </div>
          <div className={styles.appointments__details__rowItem}>
            <FontAwesomeIcon icon={faWallet} color={'#3AB286'} />
            <span>Pay in cash</span>
          </div>
        </div>
        <div className={styles.appointments__details__separator}></div>
        <div className={styles.appointments__details__row}>
          <div className={`${styles.appointments__details__rowItem} ${styles.appointments__details__rowItemClickable}`} onClick={reschedule}>
            <FontAwesomeIcon icon={faPencil} color={'#FFE72E'} />
            <span>Reschedule</span>
          </div>
          <div className={`${styles.appointments__details__rowItem} ${styles.appointments__details__rowItemClickable}`} onClick={cancel}>
            <FontAwesomeIcon icon={faCancel} color={'#F01900'} />
            <span>Cancel</span>
          </div>
          <div className={`${styles.appointments__details__rowItem} ${styles.appointments__details__rowItemClickable}`} onClick={confirm}>
            <div className={styles.mainAction}>{appointment.status == 'Confirmed' ? 'DONE' : 'CONFIRM'}</div>
          </div>
        </div>
      </div>
      }
    </div>
  )
}