import { forwardRef, useContext, useImperativeHandle, useState } from "react";
import styles from '../styles/forms/confirmation.module.scss';
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "../components/Button";
import { BookingFormContext } from "../pages/book";
import useAuthGuard from '../guards/auth.guard';

const BookConfirmationForm = forwardRef(({ }: any, ref) => {
  const { session, status } = useAuthGuard();

  const { onStepBack,
    selectedPaymentMethod,
    selectedDate,
    selectedTimeUnit,
    patientForm,
    servicesForm
  }: any = useContext(BookingFormContext);

  const formattedDate = selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  const back = (e: any) => {
    e.preventDefault();
    onStepBack(e);
  }

  useImperativeHandle(ref, () => ({
    checkValidForm: () => {
      return true;
    }
  }))

  const confirmBooking = async () => {
    if (!session) return
    const user = session.user

    const payload = {
      dentistService: servicesForm.service.name || 'Consultation',
      date: selectedDate, //new Date(selectedDate).toISOString().substring(0, 10),
      timeUnit: selectedTimeUnit,
      price: servicesForm.service.price || 500,
      paymentMethod: selectedPaymentMethod,
      concern: servicesForm.concern,
      details: patientForm
    }

    Object.assign(payload, { [`${user.role}Id`]: user.id })

    console.log(payload);

    // Confirm Booking API Call Here
    fetch(`/api/${user.role}/appointment/book`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
    .then(async (response) => {
      const responseMsg = await response.json()
      if (!response.ok) {
        alert('Booking failed: ' + JSON.stringify(responseMsg))
      } else {
        alert('appointment booked successfully!');
        console.log('appointment booked ', responseMsg);
        window.location.href = '/book';
      }
    })
    .catch(error => {
      alert('appointment booking failed');
      console.error('Error data:', error);
    });
  }

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
              <span>{servicesForm.service.price || '500.00'}</span>
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
    </div>
  )
})

export default BookConfirmationForm;