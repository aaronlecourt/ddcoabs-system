import { forwardRef, useContext, useImperativeHandle } from "react";
import styles from '../styles/forms/services.module.scss';
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "../components/Button";
import { BookingFormContext } from "../pages/book";

export const servicesCollection = [
  {
    name: 'Plastic (heat cure/lab fabricated)',
    price: 3500,
    selected: true
  },
  {
    name: 'PMMA (Polymethy Methacrylate)',
    price: 5000,
    selected: false
  },
  {
    name: 'PFM',
    price: 5000,
    selected: false
  },
  {
    name: 'PFT (Tilite)',
    price: 10000,
    selected: false
  },
  {
    name: 'EMAX',
    price: 20000,
    selected: false
  },
  {
    name: 'Zirconia',
    price: 25000,
    selected: false
  },
]

const BookServicesForm = forwardRef(({ }: any, ref) => {
  const { onStepNext, onStepBack, services, setServices, concern, setConcern }: any = useContext(BookingFormContext);

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

  const selectService = (service: any) => {
    setServices((prevValue: any) => {
      return prevValue.map((s: any) => {
        s.selected = false;

        if (s.name == service.name) {
          s.selected = true;
        }

        return s
      })
    })
  }

  const handleConcernChange = (e: any) => {
    e.preventDefault();

    setConcern(e.target.value);
  }

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
            {services.filter(v => v.type == 'Jacket Crowns').map((service: any) =>
              <li key={service.name} className={service.selected ? styles.selected : ''}
                onClick={() => selectService(service)}
              >
                <span>{service.name}</span>
                <span>P {(service.price || 0).toFixed(2)}</span>
              </li>
            )}
          </ul>
          <strong>Removable Partial Denture</strong>
          <ul className={styles.services}>
            {services.filter(v => v.type == 'Removable Partial Denture').map((service: any) =>
              <li key={service.name} className={service.selected ? styles.selected : ''}
                onClick={() => selectService(service)}
              >
                <span>{service.name}</span>
                <span>P {(service.price || 0).toFixed(2)}</span>
              </li>
            )}
          </ul>
        </div>
        <div className={styles.servicesContainer}>
          <strong>Concern:</strong>
          <br />
          <textarea rows={5} cols={50} value={ concern } onChange={e => handleConcernChange(e) } placeholder="Please indicate here your concern if unsure of the needed service...." />
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