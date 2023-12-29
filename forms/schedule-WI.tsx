import { forwardRef, useContext, useImperativeHandle } from "react";
import styles from '../styles/forms/schedule.module.scss';
import Button from "../components/Button";
import { BookingFormContextDentist } from "../pages/walk-in";
import CustomCalendar from "../components/CustomCalendar";

const BookWalkInScheduleForm = forwardRef(({ }: any, ref) => {

  const { onStepNext, onStepBack,
    selectedDate, setSelectedDate,
    selectedStartTime, setSelectedStartTime,
    selectedEndTime, setSelectedEndTime,
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

    // FOR SCHEDULING
    const setTimeAndUnit = (hour: any) => {
        setSelectedStartTime(hour);
        setSelectedTimeUnit(hour >= 12 ? 'PM' : 'AM');
    };

    const handleStartTimeSelection = (e: any) => {
        const selectedStartHour = parseInt(e.target.value, 10);
        setSelectedStartTime(selectedStartHour);
    
        if (selectedEndTime < selectedStartHour) {
            setSelectedEndTime(selectedStartHour);
        }

        setTimeAndUnit(selectedStartHour);
      };

      const handleEndTimeSelection = (e: any) => {
        const selectedEndHour = parseInt(e.target.value, 10);
    
        // If the selected end time is earlier than the start time, prevent updating the end time
        if (selectedEndHour >= selectedStartTime) {
            setSelectedEndTime(selectedEndHour);
        }
      };

      const generateTimeOptions = (selectedStartTime: any, selectedEndTime: any) => {
        const options = [];
        for (let hour = selectedStartTime; hour <= selectedEndTime; hour++) {
          const formattedHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
          options.push(
            <option key={hour} value={hour}>
              {`${formattedHour}:00`}
            </option>
          );
        }
        return options;
      };

  // SET AUTOMATIC TIME AND DATE

  const setCurrentDateTime = (e: any) => {
    e.preventDefault();
  
    const currentDate = new Date();
    const hours = currentDate.getHours();
    const timeUnit = hours >= 12 ? 'PM' : 'AM';
  
    setSelectedDate(currentDate);
    setSelectedStartTime(hours);
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
          <div className={styles.form__container}>
            <strong>Select Start Time</strong>
            <select value={selectedStartTime} onChange={handleStartTimeSelection}>
                {generateTimeOptions(8, 16)}
            </select>
            </div>
            <div className={styles.form__container}>
                <strong>Select End Time</strong>
                <select value={selectedEndTime} onChange={handleEndTimeSelection}>
                    {generateTimeOptions(selectedStartTime, 17)} 
                </select>
            </div>
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