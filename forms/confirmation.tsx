import { forwardRef, useContext, useImperativeHandle, useState } from "react";
import styles from '../styles/forms/confirmation.module.scss';
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "../components/Button";
import { BookingFormContext } from "../pages/book";

const BookConfirmationForm = forwardRef(({ }: any, ref) => {
  const { onStepBack,
    services,
    selectedPaymentMethod,
    selectedDate,
    selectedTimeUnit
  }: any = useContext(BookingFormContext);

  const formattedDate = selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  const getSelectedService = () => {
    return services.find((service: any) => service.selected);
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

  const confirmBooking = () => {
    const payload = {
      service: getSelectedService().name,
      date: formattedDate,
      time: selectedTimeUnit,
      amount: getSelectedService().price,
      paymentMethod: selectedPaymentMethod
    }

    console.log(payload);

    // Confirm Booking API Call Here
    alert('Confirm Booking API Call Here')
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
              <span>{getSelectedService().name}</span>
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
              <span>{getSelectedService().price}</span>
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