import { forwardRef, useContext, useImperativeHandle, useState } from "react";
import styles from '../styles/forms/services.module.scss';
import { faInfo, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "../components/Button";
import { BookingFormContext } from "../pages/book";

const BookServicesForm = forwardRef(({ }: any, ref) => {
  const { onStepNext, onStepBack }: any = useContext(BookingFormContext);

  const [services, setServices] = useState([
    {
      name: 'Plastic (heat cure/lab fabricated)',
      price: 'P 3,500.00',
      selected: true
    },
    {
      name: 'PMMA (Polymethy Methacrylate)',
      price: 'P 5,000.00',
      selected: false
    },
    {
      name: 'PFM',
      price: 'P 5,000.00',
      selected: false
    },
    {
      name: 'PFT (Tilite)',
      price: 'P 10,000.00',
      selected: false
    },
    {
      name: 'EMAX',
      price: 'P 20,000.00',
      selected: false
    },
    {
      name: 'Zirconia',
      price: 'P 25,000.00',
      selected: false
    },
  ]);

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
    <div className={styles.servicesForm}>
      <div className={styles.noteContainer}>
        <FontAwesomeIcon icon={faInfoCircle} color={'#3AB286'} width={30} height={30} />
        <p className={styles.note}><span className={styles.noteText}>Note:</span> The following charges are all based on the least type of case. Depending on your assessment, the clinic may charge higher whenever deemed necessary.</p>
      </div>
      <div className={styles.container}>
        <div className={styles.servicesContainer}>
          <strong>Jacket Crowns</strong>
          <ul className={styles.services}>
            {services.map(service =>
              <li key={service.name} className={service.selected ? styles.selected : ''}>
                <span>{service.name}</span>
                <span>{service.price}</span>
              </li>
            )}
          </ul>
        </div>
        <div className={styles.servicesContainer}>
          <strong>Concern:</strong>
          <br />
          <textarea rows={5} cols={50} placeholder="Please indicate here your concern if unsure of the needed service...." />
          <br />
          <div className={styles.buttons}>
            <div>
              <Button type='secondary' onClick={back}>Back</Button>
            </div>
            <div>
              <Button onClick={next}>Next</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

export default BookServicesForm;