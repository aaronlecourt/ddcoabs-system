import { forwardRef, useContext, useImperativeHandle } from "react";
import styles from '../styles/forms/schedule.module.scss';
import { faCaretLeft, faCaretRight, faChevronLeft, faChevronRight, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "../components/Button";
import { BookingFormContext } from "../pages/book";
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';

const localizer = momentLocalizer(moment);

const BookScheduleForm = forwardRef(({ }: any, ref) => {
  const { onStepNext, onStepBack,
    selectedDate, setSelectedDate,
    selectedTimeUnit, setSelectedTimeUnit
  }: any = useContext(BookingFormContext);

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

  const navigateForward = () => {
    const nextMonthDate = moment(selectedDate).add(1, 'months').toDate();
    setSelectedDate(nextMonthDate);
  };

  const navigateBackward = () => {
    const previousMonthDate = moment(selectedDate).subtract(1, 'months').toDate();
    setSelectedDate(previousMonthDate);
  };

  const customToolbar = ({ label }: any) => {
    return (
      <div className="custom-calendar__toolbar">
        <strong className="custom-calendar__toolbar__title">{label}</strong>
        <div className="custom-calendar__toolbar__nav">
          <FontAwesomeIcon onClick={navigateBackward}
            icon={faChevronLeft} />
          <FontAwesomeIcon onClick={navigateForward}
            icon={faChevronRight} />
        </div>
      </div>
    )
  }

  const formats = {
    weekdayFormat: (date: any) => localizer.format(date, 'dd')[0],
    dateFormat: (date: any) => localizer.format(date, 'D')
  }

  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    setSelectedDate(start);
  };

  return (
    <div className={styles.container}>
      <div className={styles.form}>
        <div className={styles.form__container}>
          <strong>Select Date</strong>
          <div className={styles.calendarContainer}>
          <Calendar
            date={selectedDate}
            onNavigate={() => null}
            localizer={localizer}
            formats={formats}
            startAccessor="start"
            endAccessor="end"
            selectable
            onSelectSlot={handleSelectSlot}
            components={{
              toolbar: customToolbar,
            }}
            className="custom-calendar"
          />
          </div>
        </div>
        <div className={styles.form__container}>
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
        <div className={`${styles.form__container} ${styles.actions}`}>
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