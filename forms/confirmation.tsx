import { forwardRef, useContext, useImperativeHandle } from "react";
import styles from '../styles/forms/confirmation.module.scss';
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "../components/Button";
import { BookingFormContext } from "../pages/book";
import useAuthGuard from '../guards/auth.guard';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BookConfirmationForm = forwardRef(({ }, ref) => {
  const { session } = useAuthGuard();

  const {
    onStepBack,
    selectedPaymentMethod,
    selectedDate,
    selectedTimeUnit,
    patientForm,
    servicesForm,
    patientFormDentist,
  }:any = useContext(BookingFormContext);

  const formattedDate = selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

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

    let payload = {};

    if (user.role === 'patient') {
      payload = {
        dentistService: servicesForm.service.name || 'Consultation',
        date: selectedDate,
        timeUnit: selectedTimeUnit,
        price: servicesForm.service.price || 500,
        paymentMethod: selectedPaymentMethod,
        concern: servicesForm.concern,
        details: patientForm,
        [`${user.role}Id`]: user.id,
      };
    } else {
      payload = {
        dentistService: servicesForm.service.name || 'Consultation',
        date: selectedDate,
        timeUnit: selectedTimeUnit,
        price: servicesForm.service.price || 500,
        paymentMethod: selectedPaymentMethod,
        concern: servicesForm.concern,
        patientName: patientFormDentist.patientName,
        [`${user.role}Id`]: user.id,
      };
    }

    // const payload = {
    //   dentistService: servicesForm.service.name || 'Consultation',
    //   date: selectedDate,
    //   timeUnit: selectedTimeUnit,
    //   price: servicesForm.service.price || 500,
    //   paymentMethod: selectedPaymentMethod,
    //   concern: servicesForm.concern,
    //   details: patientForm,
    //   [`${user.role}Id`]: user.id,
    // };

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
        window.location.href = '/book';
      }
    } catch (error) {
      toast.error('Appointment booking failed', { autoClose: false });
      console.error('Error data:', error);
    }
  };

  const isDentist = patientFormDentist && patientFormDentist.patientName;

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
            {isDentist && (
              <div className={styles.details__row}>
                <label>Patient Name:</label>
                <span>{patientFormDentist.patientName}</span>
              </div>
            )}
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
              <span>{selectedTimeUnit}</span>
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
                <Button type='secondary' onClick={back}>Back</Button>
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

export default BookConfirmationForm;
