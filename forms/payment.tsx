import { forwardRef, useContext, useImperativeHandle, useState } from "react";
import styles from '../styles/forms/payment.module.scss';
import { faCashRegister, faInfo, faInfoCircle, faWallet } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "../components/Button";
import { BookingFormContext } from "../pages/book";

const BookPaymentForm = forwardRef(({ }: any, ref) => {
  const { onStepNext, onStepBack, 
    services, 
    selectedPaymentMethod, setSelectedPaymentMethod ,
    selectedDate,
    selectedTimeUnit 
  }: any = useContext(BookingFormContext);

  const getSelectedService = () => {
    return services.find((service: any) => service.selected);
  }

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
      <div className={styles.form}>
        <div className={styles.form__container}>
          <strong>Choose your payment method</strong>
          <div className={styles.details}>
            <div className={styles.details__row}>
              <label>Service:</label>
              <span>{getSelectedService().name}</span>
            </div>
            <div className={styles.details__row}>
              <label>Date:</label>
              <span>March 20, 2023</span>
            </div>
            <div className={styles.details__row}>
              <label>Time:</label>
              <span>{selectedTimeUnit}</span>
            </div>
            <div className={styles.details__row}>
              <label>Base Amount:</label>
              <span>{getSelectedService().price}</span>
            </div>
            <div className={styles.details__row}>
              <p>Please click on the preferred method to proceed.</p>
            </div>
            <div className={`${styles.details__row} ${styles.details__rowAligned}`}>
              <div onClick={() => setSelectedPaymentMethod('cash')}
                className={`${styles.paymentMethod} ${selectedPaymentMethod == 'cash' ? styles.selected : ''}`}>
                <FontAwesomeIcon icon={faWallet} size="2x" />
                <span>Pay in cash</span>
              </div>
              <div onClick={() => setSelectedPaymentMethod('gcash')}
                className={`${styles.paymentMethod} ${selectedPaymentMethod == 'gcash' ? styles.selected : ''}`}>
                <FontAwesomeIcon icon={faCashRegister} size="2x" />
                <span>GCash</span>
              </div>
            </div>
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

export default BookPaymentForm;