import { forwardRef, useContext, useImperativeHandle } from "react";
import styles from '../styles/forms/schedule.module.scss';
import styles1 from '../styles/pages/home.module.scss';
import Button from "../components/Button";
import { BookingFormContextDentist } from "../pages/walk-in";
import CancelButton from "../components/CancelButton";
import CustomCalendar from "../components/CustomCalendar";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

    // FOR MANUAL SCHEDULING
    const setTimeAndUnit = (hour: any) => {
        setSelectedStartTime(hour);
        setSelectedTimeUnit(hour >= 12 ? 'PM' : 'AM');
    };

    const handleStartTimeSelection = (e: any) => {
        const selectedStartHour = parseInt(e.target.value, 10);
          
      
          if (selectedEndTime < selectedStartHour) {
              setSelectedEndTime(selectedStartHour);
          }

          if (selectedStartHour === 12) {
            toast.error("Start time cannot be 12:00 PM!");
            return; 
          }
          
          if (selectedEndTime === selectedStartHour) {
            toast.error("Start time and End time should not be THE SAME!")
            setSelectedEndTime(selectedStartHour + 1)
            return;
          }
          setSelectedStartTime(selectedStartHour);
          setTimeAndUnit(selectedStartHour);
        };

      const handleEndTimeSelection = (e: any) => {
        const selectedEndHour = parseInt(e.target.value, 10);

        if (selectedStartTime === selectedEndHour) {
          toast.error("Start time and End time should not be THE SAME!")
          return;
        }
    
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
    
    setSelectedEndTime( selectedEndTime + +1);
    setSelectedDate(currentDate);
    setSelectedStartTime(hours);
    setSelectedTimeUnit(timeUnit);
    setSelectedEndTime(hours + 1);

    onStepNext(e);
  };
  const isButtonDisabled = selectedStartTime === 8 && selectedEndTime === 17;
  
  return (
    <div className={styles.container}>
      <ToastContainer />
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
          <div className={styles.form__row2}>
            <div className={styles.form__row__field__label}>
              <label>Select Start Time</label>
            </div>
            <div className={styles1.filters__sortDropdown}>
              <select value={selectedStartTime} onChange={handleStartTimeSelection}>
                  {generateTimeOptions(8, 16)}
              </select>
            </div>
          </div>
          <div className={styles.form__row2}>
                <div className={styles.form__row__field__label}>
                  <label>Select End Time</label>
                </div>
                <div className={styles1.filters__sortDropdown}>
                  <select value={selectedEndTime} onChange={handleEndTimeSelection}>
                      {generateTimeOptions(selectedStartTime, 17)} 
                  </select>
                </div>
            </div>
          <div className={styles.timeUnit}>
            <div
              className={selectedTimeUnit == 'AM' ? styles.selected : ''}>AM</div>
            <div
              className={selectedTimeUnit == 'PM' ? styles.selected : ''}>PM</div>
          </div>
          {selectedStartTime && isButtonDisabled ? (
            <Button type="secondary" onClick={setCurrentDateTime}>
              Select Walk-in Date/Time
            </Button>
          ) : (
            <CancelButton>
              Select Walk-in Date/Time
            </CancelButton>
          )}
        </div>
        <div className={`${styles.form__container} ${styles.actions}`}>
          <div>
            <CancelButton onClick={back}>Back</CancelButton>
          </div>
          <div>
            <Button onClick={next}>Next</Button>
          </div>
        </div>
      </div>
    </div>
  )
})

export default BookWalkInScheduleForm;