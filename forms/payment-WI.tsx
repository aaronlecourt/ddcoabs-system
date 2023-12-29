import { forwardRef, useContext, useImperativeHandle } from "react";
import styles from '../styles/forms/payment.module.scss';
import { faCashRegister, faWallet } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "../components/Button";

import { BookingFormContextDentist } from "../pages/walk-in";

const BookWalkInPaymentForm = forwardRef(({ }: any, ref) => {

    const { onStepNext, onStepBack,
    servicesForm,
    selectedPaymentMethod, setSelectedPaymentMethod,
    selectedDate,
    selectedTimeUnit
  }: any = useContext(BookingFormContextDentist);

  const formattedDate = selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

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
              <label>Base Amount:</label>
              <span>P {servicesForm.service.price || '500.00'}</span>
            </div>
            <div className={styles.details__row}>
              <p>Please click on the preferred method to proceed.</p>
            </div>
            <div className={`${styles.details__row} ${styles.details__rowAligned}`}>
              <div onClick={() => setSelectedPaymentMethod('Pay in Cash')}
                className={`${styles.paymentMethod} ${selectedPaymentMethod == 'Pay in Cash' ? styles.selected : ''}`}>
                <FontAwesomeIcon icon={faWallet} size="2x" width={50} />
                <span>Pay in cash</span>
              </div>
              <div onClick={() => setSelectedPaymentMethod('GCash')}
                className={`${styles.paymentMethod} ${selectedPaymentMethod == 'GCash' ? styles.selected : ''}`}>
                <div style={{ width: 50 }}>
                  <svg fill="none" height="50" viewBox="0 0 192 192" width="50" xmlns="http://www.w3.org/2000/svg">
                    <path d="m84 96h36c0 19.882-16.118 36-36 36s-36-16.118-36-36 16.118-36 36-36c9.941 0 18.941 4.03 25.456 10.544" stroke={selectedPaymentMethod == 'GCash' ? '#3AB286' : '#737373'} stroke-linecap="round" stroke-linejoin="round" stroke-width="12"/>
                    <path d="m145.315 66.564a6 6 0 0 0 -10.815 5.2zm-10.815 53.671a6 6 0 0 0 10.815 5.201zm-16.26-68.552a6 6 0 1 0 7.344-9.49zm7.344 98.124a6 6 0 0 0 -7.344-9.49zm-41.584 2.193c-30.928 0-56-25.072-56-56h-12c0 37.555 30.445 68 68 68zm-56-56c0-30.928 25.072-56 56-56v-12c-37.555 0-68 30.445-68 68zm106.5-24.235c3.523 7.325 5.5 15.541 5.5 24.235h12c0-10.532-2.399-20.522-6.685-29.436l-10.815 5.2zm5.5 24.235c0 8.694-1.977 16.909-5.5 24.235l10.815 5.201c4.286-8.914 6.685-18.904 6.685-29.436zm-56-56c12.903 0 24.772 4.357 34.24 11.683l7.344-9.49a67.733 67.733 0 0 0 -41.584-14.193zm34.24 100.317c-9.468 7.326-21.337 11.683-34.24 11.683v12a67.733 67.733 0 0 0 41.584-14.193z" fill={selectedPaymentMethod == 'GCash' ? '#3AB286' : '#737373'}/>
                    <path d="m161.549 58.776c5.416 11.264 8.451 23.89 8.451 37.224s-3.035 25.96-8.451 37.223" stroke={selectedPaymentMethod == 'GCash' ? '#3AB286' : '#737373'} stroke-linecap="round" stroke-linejoin="round" stroke-width="12"/>
                  </svg>
                </div>
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

export default BookWalkInPaymentForm;