import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styles from './style.module.scss'
import styles1 from "../../styles/pages/home.module.scss";
import { faCalendar, faCancel, faCheckCircle, faCheckDouble, faChevronDown, faChevronRight, faClock, faEye, faFemale, faMale, faMoneyBill, faNoteSticky, faPencil, faUser, faWallet } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useState } from 'react';
import APPOINTMENT_STATUS from "../../constants/appointmentStatus";
import { IAppointment } from '../../pages/interfaces/IAppointment';
import Modal from '../Modal';
import Button from '../Button';

export default function Appointment({ appointment, onCancelAppointment, isPatient }: any) {
  const [collapse, setCollapse] = useState(true);
  const [name, setName] = useState(appointment.patientName || '')
  const [sex, setSex] = useState(appointment.patientSex || '')
  const [showModal, setShowModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showAgreeModal, setShowAgreeModal] = useState(false);
  const [selectedAppointmentDetails, setSelectedAppointmentDetails] = useState<any>(null);

  const toggleModal = () => {
    setShowModal(!showModal);
    setSelectedAppointmentDetails(appointment);
  };

  const toggleAgreeModal = () => {
    setShowAgreeModal(!showAgreeModal);
    setSelectedAppointmentDetails(appointment);
  };

  const openAppointment = (e: any) => {
    e.preventDefault();
    setCollapse(!collapse)
  }

  const reschedule = () => {
  window.location.href = `/reschedule/${appointment._id}`;
  }

  const cancel = () => {
    console.log('Cancelling appointment:', appointment);
    onCancelAppointment(appointment);
  }

  const confirm = () => {
    window.location.href= `/confirmation/${appointment._id}`;
  }

  const formattedDate = (appointmentDate: Date) => {
    return appointmentDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) 
  }

  const formattedTime = (appointment: any) => {
    const { status, startTime, endTime } = appointment;
    let { timeUnit } = appointment
    timeUnit = timeUnit.toLowerCase()
    return status == APPOINTMENT_STATUS.pending || (!startTime && !endTime)
      ? timeUnit.toUpperCase()
      : timeUnit == 'am'
      ? `${startTime}:00${timeUnit}-${endTime}:00${endTime == 12 ? 'pm' : 'am'}`
      : `${startTime == 12 ? 12 : startTime - 12}:00${timeUnit}-${endTime - 12}:00${timeUnit}` 
  }

  const getPatientName = async () => {
    try {
      if (appointment.patientId && !appointment.patientName) {
        const response = await fetch(`/api/global/user/${appointment.patientId}`);
        const patient = await response.json();
        if (patient && patient.name) {
          // Update the appointment's patientName property
          appointment.patientName = patient.name;
          setName(patient.name);
        }
      }
    } catch (error) {
      // Handle errors when fetching patient details
      console.error('Error fetching patient name:', error);
    }
  };
  

  const getPatientSex = async () => {
    try {
      if (appointment.patientId) {
        const response = await fetch(`/api/global/user/${appointment.patientId}`);
        const patient = await response.json();
        
        if (patient) {
          // Set patient's sex if available
          setSex(patient?.sex || ''); // Assuming a state variable to hold the patient's sex
        }
      }
    } catch (error) {
      // Handle errors when fetching patient details
      console.error('Error fetching patient sex:', error);
    }
  };
  useEffect(() => {
    getPatientSex();
    getPatientName();
  }, [])

  const toggleConfirmationModal = () => {
    setShowConfirmationModal(!showConfirmationModal);
  };

  const confirmDone = async () => {
    try {
      const response = await fetch(`/api/dentist/appointment/done/${appointment._id}`, {
        method: 'PUT',
      });
  
      if (response.ok) {
        alert('Appointment marked as done!');
        // Optionally, you can update the UI to reflect the change to 'done'
      } else {
        alert('Failed to mark appointment as done');
      }
    } catch (error) {
      console.error('Error marking appointment as done:', error);
      alert('Failed to mark appointment as done');
    } finally {
      toggleConfirmationModal();
    }
  };

  const confirmAgree = async () => {
    try {
      const response = await fetch(`/api/dentist/appointment/agree/${appointment._id}`, {
        method: 'PUT',
      });
  
      if (response.ok) {
        alert('Appointment confirmed!');
      } else {
        alert('Failed to confirm appointment');
      }
    } catch (error) {
      console.error('Error marking appointment as cofirmed:', error);
      alert('Failed to mark appointment as cofirmed');
    } finally {
      toggleAgreeModal();
    }
  };

  return (
    <div className={styles.appointments__itemContainer}>
      {showModal && selectedAppointmentDetails && (
        <Modal open={toggleModal} setOpen={toggleModal} modalWidth={900} modalRadius={10}>
          {/* Render appointment details here */}
          <div className={styles.apptDetails_Header}>
            <div>
              <h3>{selectedAppointmentDetails.dentistService}</h3>
              {selectedAppointmentDetails.concern && <h5>Concern: "{selectedAppointmentDetails.concern}" </h5>}
            </div>
            <div className={`${styles.appointments__status} 
              ${selectedAppointmentDetails.status == APPOINTMENT_STATUS.confirmed ? styles.appointments__statusConfirmed 
              : selectedAppointmentDetails.status == APPOINTMENT_STATUS.canceled ? styles.appointments__statusCanceled
              : selectedAppointmentDetails.status == APPOINTMENT_STATUS.done ? styles.appointments__statusDone 
              : selectedAppointmentDetails.status == APPOINTMENT_STATUS.rescheduled ? styles.appointments__statusRescheduled 
              : styles.appointments__statusPending}`}>{selectedAppointmentDetails.status}
            </div>
            {!isPatient && 
              <div className={styles.apptDetails_User}>
              <div>
                <FontAwesomeIcon icon={faUser} color={'#3AB286'} width={15} />
                <span> {appointment.patientName || name || ''}</span>
              </div>
              {sex === 'M' && (
                <div className={styles.apptDetails_UserGender}>
                  <FontAwesomeIcon icon={faMale} color={'#fff'} width={15} />
                  <span>Male</span>
                </div>
              )}
              {sex === 'F' && (
                <div className={styles.apptDetails_UserGender}>
                  <FontAwesomeIcon icon={faFemale} color={'#fff'} width={15} />
                  <span>Female</span>
                </div>
              )}
            </div>
            }
          </div>
          
          <div className={styles.apptDetails_Dateprice}>
            <div className={styles.appointments__details__row}>
              <div className={styles.appointments__details__rowItem}>
                <FontAwesomeIcon icon={faCalendar} color={'#3AB286'} width={15}/>
                <span>{formattedDate(new Date(selectedAppointmentDetails.date))}</span>
              </div>
              <div className={styles.appointments__details__rowItem}>
                <FontAwesomeIcon icon={faClock} color={'#3AB286'} width={15}/>
                <span>{formattedTime(selectedAppointmentDetails)}</span>
              </div>
              <div className={styles.appointments__details__rowItem}>
                <FontAwesomeIcon icon={faWallet} color={'#3AB286'} width={15}/>
                <span>{selectedAppointmentDetails.paymentMethod}</span>
              </div>
              <div className={styles.appointments__details__rowItem}>
                <FontAwesomeIcon icon={faMoneyBill} color={'#3AB286'} width={15}/>
                <span>P{selectedAppointmentDetails.price}</span>
              </div>
            </div>
            
          </div>

        <hr className={styles.apptDetails_Divide}/>
          
          <div className={styles.apptDetails_OtherDetails}>
            <p><b>Name of Physician:</b> {selectedAppointmentDetails.details.physicianName}</p>
            {selectedAppointmentDetails.details.specialty ? (
              <p><b>Specialty:</b> {selectedAppointmentDetails.details.specialty}</p>
            ) : (
              <p><b>Specialty:</b> none</p>
            )}
            {selectedAppointmentDetails.details.officeAddress ? (
              <p><b>Office Address:</b> {selectedAppointmentDetails.details.officeAddress}</p>
            ) : (
              <p><b>Office Address:</b> none</p>
            )}
          </div>

          <div className={styles.apptDetails_More}>
            <div className={styles.apptDetails_Sub}>
              <h3>Medical History</h3>
              <p>Good Health: {selectedAppointmentDetails.details.goodHealth}</p>
              <p>Medical Treatment: {selectedAppointmentDetails.details.medicalTreatment}</p>
                {selectedAppointmentDetails.details.medicalTreatment === 'yes' && (
                  <span>{selectedAppointmentDetails.details.medicalTreatmentValue}</span>
                )}
              <p>Illness: {selectedAppointmentDetails.details.illness}</p>
                {selectedAppointmentDetails.details.illness === 'yes' && (
                  <span>{selectedAppointmentDetails.details.illnessValue}</span>
                )}
              <p>Hospitalized: {selectedAppointmentDetails.details.hospitalized}</p>
                {selectedAppointmentDetails.details.hospitalized === 'yes' && (
                  <span>{selectedAppointmentDetails.details.hospitalizedValue}</span>
                )}
              <p>Medication: {selectedAppointmentDetails.details.medication}</p>
                {selectedAppointmentDetails.details.medication === 'yes' && (
                  <span>{selectedAppointmentDetails.details.medicationValue}</span>
                )}
              <p>Tobacco: {selectedAppointmentDetails.details.tobacco}</p>
              <p>Alcohol: {selectedAppointmentDetails.details.alchohol}</p>
              <p>Allergy: {selectedAppointmentDetails.details.allergy}</p>
                {selectedAppointmentDetails.details.allergy === 'yes' && (
                  <span>{selectedAppointmentDetails.details.allergyValue}</span>
                )}                
              {sex === 'F' && (
                <>
                <p>Pregnant: {selectedAppointmentDetails.details.pregnant}</p>
                <p>Nursing: {selectedAppointmentDetails.details.nursing}</p>
                <p>Birth Control: {selectedAppointmentDetails.details.birthControl}</p>  
                </>
              )}
              
              {selectedAppointmentDetails.details.others && !isPatient && (
                <>
                <br />
                  <h3>Have or has had:</h3>
                  {selectedAppointmentDetails.details.others ? (
                    selectedAppointmentDetails.details.others.map((item: string, index: number) => (
                      <li key={index}>{item}</li>
                    ))
                  ) : (
                    <li>N/A</li>
                  )}
                </>
              )}
              
                  
            </div>
            <div className={styles.apptDetails_Sub}>
              <h3>Dental History</h3>
              <p>Previous Dentist: {selectedAppointmentDetails.details.previousDentist || 'N/A'}</p>
              <p>Previous Treatment: {selectedAppointmentDetails.details.previousTreatment || 'N/A'}</p>
              <p>Last Dental Visit: {selectedAppointmentDetails.details.lastDentalVisit || 'N/A'}</p>
            </div>
          </div>
        </Modal>
      )}

      {showConfirmationModal && (
        <Modal
          open={toggleConfirmationModal}
          setOpen={toggleConfirmationModal}
          modalWidth={400} modalRadius={10}
        >
          <h3 className={styles1.cancelTitle}>Mark as Done</h3>
          <div className={styles1.cancelText}>
            <div style={{ width: "54px", height: "54px" }}>
              <FontAwesomeIcon
                icon={faCheckCircle}
                size="3x"
                width={54}
                height={54}
                color={'#3AB286'}
              />
            </div>
            <p>
              Do you want to mark this appointment as done? This action
              is not irreversible.
            </p>
          </div>
          <div className={styles1.cancelActions}>
            <Button
              type="secondary"
              onClick={toggleConfirmationModal}
            >
              No
            </Button>
            <Button onClick={confirmDone}>Yes</Button>
          </div>
        </Modal>
      )}

      {showAgreeModal && (
        <Modal
          open={toggleAgreeModal}
          setOpen={toggleAgreeModal}
          modalWidth={400} modalRadius={10}
        >
          <h3 className={styles1.cancelTitle}>Rescheduled Appointment Confirmation</h3>
          <div className={styles1.cancelText}>
            <div style={{ width: "54px", height: "54px" }}>
              <FontAwesomeIcon
                icon={faCheckCircle}
                size="3x"
                width={54}
                height={54}
                color={'#3AB286'}
              />
            </div>
            <p>
              Do you agree to the dentist's set date and time? This action will confirm this appointment.
            </p>
          </div>
          <div className={styles1.cancelActions}>
            <Button
              type="secondary"
              onClick={toggleAgreeModal}
            >
              No
            </Button>
            <Button onClick={confirmAgree}>Yes</Button>
          </div>
        </Modal>
      )}
      <div className={styles.appointments__item} onClick={openAppointment}>
        <div className={styles.appointments__title}>{appointment.dentistService || 'Consultation'}</div>
        {!isPatient && <div className={styles.appointments__user}>
          <FontAwesomeIcon icon={faUser} width={15} height={15} color={'#c3c3c3'} />
          <span>{ appointment.patientName || name || ''}</span>
        </div>}
        <div className={styles.appointments__statusContainer}>
          <div className={`${styles.appointments__status} 
            ${appointment.status == APPOINTMENT_STATUS.confirmed ? styles.appointments__statusConfirmed 
            : appointment.status == APPOINTMENT_STATUS.canceled ? styles.appointments__statusCanceled
            : appointment.status == APPOINTMENT_STATUS.done ? styles.appointments__statusDone 
            : appointment.status == APPOINTMENT_STATUS.rescheduled ? styles.appointments__statusRescheduled 
            : styles.appointments__statusPending}`}>{appointment.status}
          </div>
          <FontAwesomeIcon icon={!collapse ? faChevronDown : faChevronRight} width={15} height={16} color={'#737373'} />
        </div>
      </div>
      {!collapse && <div className={styles.appointments__details}>
        <div className={styles.appointments__details__row}>
          <div className={styles.appointments__details__rowItem}>
            <FontAwesomeIcon icon={faCalendar} color={'#3AB286'} width={15}/>
            <span>{formattedDate(new Date(appointment.date))}</span>
          </div>
          <div className={styles.appointments__details__rowItem}>
            <FontAwesomeIcon icon={faClock} color={'#3AB286'} width={15}/>
            <span>{formattedTime(appointment)}</span>
          </div>
          <div className={styles.appointments__details__rowItem}>
            <FontAwesomeIcon icon={faWallet} color={'#3AB286'} width={15}/>
            <span>{appointment.paymentMethod}</span>
          </div>
        </div>
        {appointment.status == APPOINTMENT_STATUS.pending && !isPatient &&
          <>
            <div className={styles.appointments__details__separator}></div>
            <div className={styles.appointments__details__row2}>
            <div className={`${styles.appointments__details__rowItem} ${styles.appointments__details__rowItemClickable}`} onClick={toggleModal}>
                <FontAwesomeIcon icon={faEye} color={'#606060'} width={15} />
                <span>Show Details</span>
              </div>
              <div className={`${styles.appointments__details__rowItem} ${styles.appointments__details__rowItemClickable}`} onClick={reschedule}>
                <FontAwesomeIcon icon={faPencil} color={'#FFE72E'} width={15} />
                <span>Reschedule</span>
              </div>
              {/* <div className={`${styles.appointments__details__rowItem} ${styles.appointments__details__rowItemClickable}`} onClick={cancel}>
                <FontAwesomeIcon icon={faCancel} color={'#F01900'} width={15} />
                <span>Cancel</span>
              </div> */}
              <div className={`${styles.appointments__details__rowItem} ${styles.appointments__details__rowItemClickable}`} onClick={confirm}>
                <div className={styles.mainAction}>CONFIRM</div>
              </div>
            </div>
          </>
        }
        {appointment.status == APPOINTMENT_STATUS.confirmed && !isPatient &&
          <>
            <div className={styles.appointments__details__separator}></div>
            <div className={styles.appointments__details__row2}>
            <div className={`${styles.appointments__details__rowItem} ${styles.appointments__details__rowItemClickable}`} onClick={toggleModal}>
                <FontAwesomeIcon icon={faEye} color={'#606060'} width={15} />
                <span>Show Details</span>
              </div>
              <div className={`${styles.appointments__details__rowItem} ${styles.appointments__details__rowItemClickable}`} onClick={reschedule}>
                <FontAwesomeIcon icon={faPencil} color={'#FFE72E'} width={15} />
                <span>Reschedule</span>
              </div>
              {/* <div className={`${styles.appointments__details__rowItem} ${styles.appointments__details__rowItemClickable}`} onClick={done}> */}
              <div className={`${styles.appointments__details__rowItem} ${styles.appointments__details__rowItemClickable}`}>
                <div className={styles.mainAction} onClick={toggleConfirmationModal}>MARK AS DONE</div>
              </div>
            </div>
          </>
        }
        {appointment.status == APPOINTMENT_STATUS.canceled && !isPatient &&
          <>
            <div className={styles.appointments__details__separator}></div>
            <div className={styles.appointments__details__row3}>
            <div className={`${styles.appointments__details__rowItem} ${styles.appointments__details__rowItemClickable}`}>
                <FontAwesomeIcon icon={faNoteSticky} color={'#909090'} width={15} />
                <span><b>Reason:</b> <i>"{appointment.cancelReason}"</i></span>
              </div>
              <div className={`${styles.appointments__details__rowItem} ${styles.appointments__details__rowItemClickable}`} onClick=  {toggleModal}>
                  <FontAwesomeIcon icon={faEye} color={'#606060'} width={15} />
                  <span>Show Details</span>
              </div>
              {/* <div className={`${styles.appointments__details__rowItem} ${styles.appointments__details__rowItemClickable}`} onClick={done}> */}
              {/* <div className={`${styles.appointments__details__rowItem} ${styles.appointments__details__rowItemClickable}`}>
                <div className={styles.mainAction}>RESOLVE</div>
              </div> */}
            </div>
          </>
        }
        {appointment.status == APPOINTMENT_STATUS.canceled && isPatient &&
          <>
            <div className={styles.appointments__details__separator}></div>
            <div className={styles.appointments__details__row2}>
              <div className={`${styles.appointments__details__rowItem} ${styles.appointments__details__rowItemClickable}`} onClick={toggleModal}>
                <FontAwesomeIcon icon={faEye} color={'#606060'} width={15} />
                <span>Show Details</span>
              </div>
            </div>
          </>
        }
        {appointment.status == APPOINTMENT_STATUS.rescheduled && !isPatient &&
          <>
            <div className={styles.appointments__details__separator}></div>
            <div className={styles.appointments__details__row2}>
            <div className={`${styles.appointments__details__rowItem} ${styles.appointments__details__rowItemClickable}`} onClick={toggleModal}>
                <FontAwesomeIcon icon={faEye} color={'#606060'} width={15} />
                <span>Show Details</span>
              </div>
              <div className={`${styles.appointments__details__rowItem} ${styles.appointments__details__rowItemClickable}`} onClick={reschedule}>
                <FontAwesomeIcon icon={faPencil} color={'#FFE72E'} width={15} />
                <span>Reschedule</span>
              </div>
            </div>
          </>
        }
        {appointment.status == APPOINTMENT_STATUS.rescheduled && isPatient &&
          <>
            <div className={styles.appointments__details__separator}></div>
            <div className={styles.appointments__details__row2}>
            <div className={`${styles.appointments__details__rowItem} ${styles.appointments__details__rowItemClickable}`} onClick={toggleModal}>
                <FontAwesomeIcon icon={faEye} color={'#606060'} width={15} />
                <span>Show Details</span>
              </div>
              <div className={`${styles.appointments__details__rowItem} ${styles.appointments__details__rowItemClickable}`} onClick={reschedule}>
                <FontAwesomeIcon icon={faPencil} color={'#FFE72E'} width={15} />
                <span>Reschedule</span>
              </div>
              <div className={`${styles.appointments__details__rowItem} ${styles.appointments__details__rowItemClickable}`} onClick={cancel}>
                <FontAwesomeIcon icon={faCancel} color={'#F01900'} width={15} />
                <span>Cancel</span>
              </div>
              <div className={`${styles.appointments__details__rowItem} ${styles.appointments__details__rowItemClickable}`}>
                <div className={styles.mainAction} onClick={toggleAgreeModal}>AGREE</div>
              </div>
            </div>
          </>
        }
        {appointment.status == APPOINTMENT_STATUS.done &&
          <>
            <div className={styles.appointments__details__separator}></div>
            <div className={styles.appointments__details__row2}>
              <div className={`${styles.appointments__details__rowItem} ${styles.appointments__details__rowItemClickable}`} onClick={toggleModal}>
                <FontAwesomeIcon icon={faEye} color={'#606060'} width={15} />
                <span>Show Details</span>
              </div>
            </div>
          </>
        }
        {appointment.status == APPOINTMENT_STATUS.pending && isPatient &&
          <>
            <div className={styles.appointments__details__separator}></div>
            <div className={styles.appointments__details__row2}>
              <div className={`${styles.appointments__details__rowItem} ${styles.appointments__details__rowItemClickable}`} onClick={toggleModal}>
                <FontAwesomeIcon icon={faEye} color={'#606060'} width={15} />
                <span>Show Details</span>
              </div>
              <div className={`${styles.appointments__details__rowItem} ${styles.appointments__details__rowItemClickable}`} onClick={reschedule}>
                <FontAwesomeIcon icon={faPencil} color={'#FFE72E'} width={15} />
                <span>Reschedule</span>
              </div>
              <div className={`${styles.appointments__details__rowItem} ${styles.appointments__details__rowItemClickable}`} onClick={cancel}>
                <FontAwesomeIcon icon={faCancel} color={'#F01900'} width={15} />
                <span>Cancel</span>
              </div>
            </div>
          </>
        }
        {appointment.status == APPOINTMENT_STATUS.confirmed && isPatient &&
          <>
            <div className={styles.appointments__details__separator}></div>
            <div className={styles.appointments__details__row2}>
              <div className={`${styles.appointments__details__rowItem} ${styles.appointments__details__rowItemClickable}`} onClick={toggleModal}>
                <FontAwesomeIcon icon={faEye} color={'#606060'} width={15} />
                <span>Show Details</span>
              </div>
              <div className={`${styles.appointments__details__rowItem} ${styles.appointments__details__rowItemClickable}`} onClick={reschedule}>
                <FontAwesomeIcon icon={faPencil} color={'#FFE72E'} width={15} />
                <span>Reschedule</span>
              </div>
              {/* <div className={`${styles.appointments__details__rowItem} ${styles.appointments__details__rowItemClickable}`} onClick={cancel}>
                <FontAwesomeIcon icon={faCancel} color={'#F01900'} width={15} />
                <span>Cancel</span>
              </div> */}
            </div>
          </>
        }
      </div>
      }
    </div>
  )
}