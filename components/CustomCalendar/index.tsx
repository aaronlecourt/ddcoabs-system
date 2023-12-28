import styles from './style.module.scss';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const localizer = momentLocalizer(moment);

export default function CustomCalendar({ selectable = true, selectedDate, setSelectedDate }: any) {
  const navigateForward = () => {
    const nextMonthDate = moment(selectedDate).add(1, 'months').toDate();
    setSelectedDate(nextMonthDate);
  };

  const navigateBackward = () => {
    let previousMonthDate = moment(selectedDate).subtract(1, 'months').toDate();
    const today = new Date();
    today.setHours(0,0,0,0);
    if (previousMonthDate < today) previousMonthDate = today;
    setSelectedDate(previousMonthDate);
  };

  const customToolbar = ({ label }: any) => {
    return (
      <div className="custom-calendar__toolbar">
        <strong className="custom-calendar__toolbar__title">{label}</strong>
        <div className="custom-calendar__toolbar__nav">
          <FontAwesomeIcon onClick={navigateBackward}
            icon={faChevronLeft} width={15} height={16} />
          <FontAwesomeIcon onClick={navigateForward}
            icon={faChevronRight} width={15} height={16} />
        </div>
      </div>
    )
  }

  const formats = {
    weekdayFormat: (date: any) => localizer.format(date, 'dd')[0],
    dateFormat: (date: any) => localizer.format(date, 'D')
  }

  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    const selectedDate = new Date(start);
    const today = new Date();
    today.setHours(0,0,0,0);
    if (selectedDate < today) return; // Beyond Today Date
    else if (selectedDate.getDay() === 0 || selectedDate.getDay() === 6) return; // is Weekend

    setSelectedDate(start);
  };

  return (
    <div className={styles.calendarContainer}>
      <Calendar
        date={selectedDate}
        onNavigate={() => null}
        localizer={localizer}
        formats={formats}
        startAccessor="start"
        endAccessor="end"
        selectable={selectable}
        onSelectSlot={handleSelectSlot}
        components={{
          toolbar: customToolbar,
        }}
        className={`custom-calendar ${!selectable ? 'custom-calendar--not-selectable' : ''}`}
      />
    </div>
  )
}