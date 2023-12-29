import { forwardRef, useContext, useImperativeHandle } from "react";
import styles from '../styles/forms/schedule.module.scss';
import Button from "../components/Button";
import { BookingFormContextDentist } from "../pages/walk-in";
import CustomCalendar from "../components/CustomCalendar";

const BookWalkInScheduleForm = forwardRef(({ }: any, ref) => {

  const { onStepNext, onStepBack,
    selectedDate, setSelectedDate,
    selectedTime, setSelectedTime,
    selectedTimeUnit, setSelectedTimeUnit
  }: any = useContext(BookingFormContextDentist);

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



  const setCurrentDateTime = (e: any) => {
    e.preventDefault();
  
    const currentDate = new Date();
    const hours = currentDate.getHours();
    const timeUnit = hours >= 12 ? 'PM' : 'AM';
  
    setSelectedDate(currentDate);
    setSelectedTime(hours);
    setSelectedTimeUnit(timeUnit);
  
    onStepNext(e);
  };

  return (
    <div className={styles.container}>
      <div className={styles.form}>
        <div className={styles.form__container}>
          <strong style={{ marginBottom: '.5rem' }}>Select Date</strong>
          <CustomCalendar 
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />
        </div>
        <div className={styles.form__container}>
          <strong>Select Time</strong>
          <div className={styles.timeUnit}>
            <div onClick={() => setSelectedTimeUnit('AM')}
              className={selectedTimeUnit == 'AM' ? styles.selected : ''}>AM</div>
            <div onClick={() => setSelectedTimeUnit('PM')}
              className={selectedTimeUnit == 'PM' ? styles.selected : ''}>PM</div>
          </div>
        </div>
        <div className={`${styles.form__container} ${styles.actions}`}>
          <div>
            <Button type='secondary' onClick={back}>Back</Button>
          </div>
          <div>
            <Button onClick={next}>Next</Button>
            <Button onClick={setCurrentDateTime}>Walk In Schedule</Button>
          </div>
        </div>
      </div>
    </div>
  )
})

export default BookWalkInScheduleForm;