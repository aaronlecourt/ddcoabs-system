import { forwardRef, useContext, useImperativeHandle } from "react";
import styles from '../styles/forms/confirmation.module.scss';
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "../components/Button";
import { BookingFormContextDentist } from "../pages/walk-in";
import useAuthGuard from '../guards/auth.guard';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CancelButton from "../components/CancelButton";

const BookWalkInConfirmationForm = forwardRef(({ }, ref) => {
  const { session } = useAuthGuard();

  const {
    onStepBack,
    selectedPaymentMethod,
    selectedDate,
    selectedTimeUnit,
    servicesForm,
    patientFormDentist,
    selectedStartTime, 
    selectedEndTime,
  }:any = useContext(BookingFormContextDentist);

  const formattedDate = selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  const convertTo12HourFormat = (time: any) => {
    let hours = time % 12 || 12; 
    const amPm = time >= 12 ? 'PM' : 'AM'; 
  
    return `${hours}:00 ${amPm}`;
  };

  const formattedStartTime = convertTo12HourFormat(selectedStartTime);
  const formattedEndTime = convertTo12HourFormat(selectedEndTime);

  const back = (e :any) => {
    e.preventDefault();
    onStepBack(e);
  };

  useImperativeHandle(ref, () => ({
    checkValidForm: () => true,
  }));

  const confirmBooking = async () => {
    if (!session) return;

    const user = session.user;

    const payload = {
        dentistService: servicesForm.service.name || 'Consultation',
        date: selectedDate,
        timeUnit: selectedTimeUnit,
        price: servicesForm.service.price || 500,
        paymentMethod: selectedPaymentMethod,
        concern: servicesForm.concern,
        patientName: patientFormDentist.patientName,
        [`${user.role}Id`]: user.id,
      };
    

    try {
      const response = await fetch(`/api/${user.role}/appointment/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        const responseMsg = await response.json();
        toast.error('Booking failed: ' + JSON.stringify(responseMsg), { autoClose: false });
      } else {
        toast.success('Appointment Booked Successfully!', { autoClose: false });
        console.log('appointment booked ', await response.json());
        window.location.href = '/';
      }
    } catch (error) {
      toast.error('Appointment booking failed', { autoClose: false });
      console.error('Error data:', error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.form}>
        <div className={styles.noteContainer}>
          <FontAwesomeIcon icon={faInfoCircle} color={'#3AB286'} width={30} height={30} />
          <p className={styles.note}><span className={styles.noteText}>Note:</span> The following charges are all based on the least type of case. Depending on your assessment, the clinic may charge higher whenever deemed necessary.</p>
        </div>
        <div className={styles.form__container}>
          <strong>Confirm Booking</strong>
          <div className={styles.details}>
              <div className={styles.details__row}>
                <label>Patient Name:</label>
                <span>{patientFormDentist.patientName}</span>
              </div>
            <div className={styles.details__row}>
              <label>Service:</label>
              <span>{servicesForm.service.name || 'Consultation'}</span>
            </div>
            <div className={styles.details__row}>
              <label>Date:</label>
              <span>{formattedDate}</span>
            </div>
            <div className={styles.details__row}>
              <label>Time:</label>
              <span>{formattedStartTime} to {formattedEndTime}</span>
            </div>
            <div className={styles.details__row}>
              <label>Base Charge:</label>
              <span>P {servicesForm.service.price || '500.00'}</span>
            </div>
            <div className={styles.details__row}>
              <label>Payment Method:</label>
              <span>{selectedPaymentMethod}</span>
            </div>
            <div className={`${styles.details__row} ${styles.actions}`}>
              <div>
                <CancelButton onClick={back}>Back</CancelButton>
              </div>
              <div>
                <Button onClick={confirmBooking}>Confirm Booking</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
});

export default BookWalkInConfirmationForm;
