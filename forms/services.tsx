import { forwardRef, useContext, useImperativeHandle } from "react";
import styles from '../styles/forms/services.module.scss';
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "../components/Button";
import { BookingFormContext } from "../pages/book";
import { handleFormDataChange, handleFormEnter } from "../utils/form-handles";
import { isServicesFormValid } from "../validations/servicesform";

export const ServicesFormObject = {
  service: '',
  concern: ''
}

export const ErrorServicesFormObject = {
  service: { error: false, message: null },
  concern: { error: false, message: null },
}

const BookServicesForm = forwardRef(({  }: any, ref) => {

  context = useContext(BookingFormContext); // Temporary

  context = useContext(BookingFormContext); // Temporary

  const { 
    onStepNext, onStepBack, 
    services, setServices, 
    servicesForm, setServicesForm,
    servicesErrorForm, setServicesErrorForm
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
      setServicesErrorForm(() => ({
        ['service']: {
          error: false,
          message: null
        },
        ['concern']: {
          error: false,
          message: null
        }
      }))

      if (servicesForm.service == '' && servicesForm.concern == '')  {
        return isServicesFormValid(servicesForm, servicesErrorForm, setServicesErrorForm)
      } else {
        return true;
      }
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

    setServicesForm((prevValue: any) => ({
      ...prevValue,
      ['service']: service
    }))

    setServicesErrorForm(() => ({
      ['service']: {
        error: false,
        message: null
      },
      ['concern']: {
        error: false,
        message: null
      }
    }))
  }

  const handleConcernChange = (e: any) => {
    setServicesErrorForm(() => ({
      ['service']: {
        error: false,
        message: null
      },
      ['concern']: {
        error: false,
        message: null
      }
    }))
    handleFormDataChange(e, setServicesForm, setServicesErrorForm)
  }

  return (
    <div className={styles.servicesForm}>
      <div className={styles.noteContainer}>
        <FontAwesomeIcon icon={faInfoCircle} color={'#3AB286'} width={30} height={30} />
        <p className={styles.note}><span className={styles.noteText}>Note:</span> The following charges are all based on the least type of case. Depending on your assessment, the clinic may charge higher whenever deemed necessary.</p>
      </div>
      <div className={styles.container}>
        <div className={styles.servicesContainer}>
          {servicesErrorForm['service'].error && <span className={`formLabel__errorMessage ${styles.errorMessage}`}>{servicesErrorForm['service'].message}</span>}
          <strong>Jacket Crowns</strong>
          <ul className={styles.services}>
            {services.filter((v: any) => v.type == 'Jacket Crowns' && !v.isArchived).map((service: any) =>
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
            {services.filter((v: any) => v.type == 'Removable Partial Denture' && !v.isArchived).map((service: any) =>
              <li key={service.name} className={service.selected ? styles.selected : ''}
                onClick={() => selectService(service)}
              >
                <span>{service.name}</span>
                <span>P {(service.price || 0).toFixed(2)}</span>
              </li>
            )}
          </ul>
          <strong>Others</strong>
          <ul className={styles.services}>
            {services.filter((v: any) => v.type == 'Others' ).map((service: any) =>
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
          {servicesErrorForm['concern'].error && <span className={`formLabel__errorMessage ${styles.errorMessage}`}>{servicesErrorForm['concern'].message}</span>}
          <strong>Concern:</strong>
          <br />
          <textarea 
            rows={5} 
            cols={50} 
            placeholder="Please indicate here your concern if unsure of the needed service...." 
            name="concern"
            value={servicesForm.concern} 
            onKeyDown={e => handleFormEnter(e, next)}
            onChange={handleConcernChange} 
          />
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