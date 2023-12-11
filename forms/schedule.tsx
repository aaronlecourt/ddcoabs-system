import { forwardRef, useContext, useImperativeHandle, useState } from "react";
import styles from '../styles/forms/schedule.module.scss';
import { faInfo, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "../components/Button";
import { BookingFormContext } from "../pages/book";

const BookScheduleForm = forwardRef(({ }: any, ref) => {
  const { onStepNext, onStepBack }: any = useContext(BookingFormContext);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeUnit, setSelectedTimeUnit] = useState('AM');

  const next = (e: any) => {
    e.preventDefault();
    onStepNext(e);
  }

  const back = (e: any) => {
    e.preventDefault();
    onStepBack(e);
  }

  useImperativeHandle(ref, () => ({
    checkValidForm: () => {
      return true;
    }
  }))

  return (
    <div className={styles.container}>
      <div className={styles.scheduleForm}>
        <div className={styles.scheduleForm__container}>
          <strong>Select Date</strong>
          <div className={styles.calendar}></div>
        </div>
        <div className={styles.scheduleForm__container}>
          <strong>Select Time</strong>
          <div className={styles.timeUnit}>
            <div onClick={() => setSelectedTimeUnit('AM')}
              className={selectedTimeUnit == 'AM' ? styles.selected : ''}>AM</div>
            <div onClick={() => setSelectedTimeUnit('PM')}
              className={selectedTimeUnit == 'PM' ? styles.selected : ''}>PM</div>
          </div>
          <div className={styles.noteContainer}>
            <FontAwesomeIcon icon={faInfoCircle} color={'#3AB286'} width={30} height={30} />
            <p className={styles.note}><span className={styles.noteText}>Note:</span> The dentist will update the specifics of the time field.</p>
          </div>
        </div>
        <div className={`${styles.scheduleForm__container} ${styles.actions}`}>
          <div>
            <Button type='secondary' onClick={back}>Back</Button>
          </div>
          <div>
            <Button onClick={next}>Next</Button>
          </div>
        </div>
      </div>
    </div>
  )
})

export default BookScheduleForm;