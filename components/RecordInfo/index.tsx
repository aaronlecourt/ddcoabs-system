import { useEffect, useState } from 'react'
import Modal from '../Modal'
import styles from './style.module.scss'
import Button from '../Button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'

export default function RecordInfo({ recordInfo, open, setOpen }: any) {
  const [activeTab, setActiveTab] = useState('Patient Info')
  const [appointments, setAppointments] = useState([])
  const [activeAppointmentId, setActiveAppointmentId] = useState(null)

  const formatDate = (date: any) => {
    const d = new Date(date)
    const options: any = {
      year: "numeric",
      month: "long",
      day: "numeric"
    };
    return d.toLocaleDateString('en', options);
  }

  const fetchUserAppointments = async () => {
    try {
      const response = await fetch("/api/global/appointment?patientId=" + recordInfo._id);
      if (!response.ok) {
        throw new Error("Failed to fetch appointments");
      }
      const data = await response.json();
      console.log(data)
      setAppointments(data)
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
    }
  };

  useEffect(() => {
    if (open) {
      setActiveTab('Patient Info')
      fetchUserAppointments()
    }
  }, [open])

  const changeActiveAppointment = (id: any) => {
    if (id === activeAppointmentId) setActiveAppointmentId(null)
    else setActiveAppointmentId(id)
  }

  const medicalHistory = (appointment: any) => {
    const details = appointment.details;
    delete details.physicianName;
    delete details.officeAddress;
    delete details.specialty;
    delete details.officeNumber;
    if (Array.isArray(details.others)) {
      details.others = details.others.join(', ');
    }

    return details;
  }

  const convertToTitleCase = (str: string) => {
    let words = str.match(/[A-Z]?[a-z]+/g) || [];
    let titleCaseString = words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    return titleCaseString;
  }

  const renderPatientInfo = () => {
    return (
      <div className={styles.information}>
        <div className={styles.information__title}>Patient Information Record</div>
        <div className={styles.information__content}>
          <div className={styles.information__row}>
            <div className={styles.information__data}>
              <label>Name: </label>
              <span>{recordInfo.lastName}, {recordInfo.firstName}</span>
            </div>
            <div className={styles.information__data}>
              <label>Date of Birth: </label>
              <span>{formatDate(recordInfo.dateOfBirth)}</span>
            </div>
            <div className={styles.information__data}>
              <label>Age: </label>
              <span>{recordInfo.age}</span>
            </div>
          </div>
          <div className={styles.information__row}>
            <div className={styles.information__data}>
              <label>Religion: </label>
              <span>{recordInfo.religion}</span>
            </div>
            <div className={styles.information__data}>
              <label>Nationality: </label>
              <span>{recordInfo.nationality}</span>
            </div>
            <div className={styles.information__data}>
              <label>Sex: </label>
              <span>{recordInfo.sex == 'M' ? 'Male' : 'Female'}</span>
            </div>
            <div className={styles.information__data}>
              <label>Home Address: </label>
              <span>{recordInfo.address}</span>
            </div>
          </div>
          <div className={styles.information__row}>
            <div className={styles.information__data}>
              <label>Contact Number: </label>
              <span>{recordInfo.contactNumber}</span>
            </div>
            <div className={styles.information__data}>
              <label>Email: </label>
              <span>{recordInfo.email}</span>
            </div>
          </div>
          <div className={styles.information__row}>
            <div className={styles.information__data}>
              <label>Parent's or Guardian's Name: </label>
              <span>{recordInfo.guardianName && recordInfo.guardianName != '' ? recordInfo.guardianName : 'N/A'}</span>
            </div>
            <div className={styles.information__data}>
              <label>Contact No: </label>
              <span>{recordInfo.guardianContactNumber && recordInfo.guardianContactNumber != '' ? recordInfo.guardianContactNumber : 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderAppointments = () => {
    return (
      <div className={`${styles.information} ${styles.informationAppointments}`}>
        {appointments.length > 0 ? appointments.map((appointment: any) =>
          <div key={appointment._id}
            className={styles.information__appointment} onClick={() => changeActiveAppointment(appointment._id)}>
            <div className={styles.information__appointment__details}>
              <span>{appointment.dentistService}</span>
              <FontAwesomeIcon icon={activeAppointmentId == appointment._id ? faChevronDown : faChevronRight} width={25} height={25} />
            </div>
            {activeAppointmentId == appointment._id && <div className={styles.information__appointment__body}>
              <div className={styles.information__content}>
                <div className={styles.information__contentTitle}>Appointment Details</div>
                <div className={styles.information__contentRow}>
                  <div className={styles.information__data}>
                    <label>Service: </label>
                    <span>{appointment.dentistService}</span>
                  </div>
                  <div className={styles.information__data}>
                    <label>Price: </label>
                    <span>{appointment.price}</span>
                  </div>
                </div>
                <div className={styles.information__contentRow}>
                  <div className={styles.information__data}>
                    <label>Date: </label>
                    <span>{formatDate(appointment.date)}</span>
                  </div>
                  <div className={styles.information__data}>
                    <label>Payment Method: </label>
                    <span>{appointment.paymentMethod}</span>
                  </div>
                </div>
                <div className={styles.information__contentRow}>
                  <div className={styles.information__data}>
                    <label>Time: </label>
                    <span>{appointment.startTime}:00 {appointment.timeUnit} - {appointment.endTime}:00 {appointment.timeUnit}</span>
                  </div>
                </div>
              </div>
              <div className={styles.information__content}>
                <div className={styles.information__contentTitle}>Medical History</div>
                <div className={styles.information__contentRow}>
                  <div className={styles.information__data}>
                    <label>Name of Physician: </label>
                    <span>{appointment.physicianName}</span>
                  </div>
                  <div className={styles.information__data}>
                    <label>Specialty: </label>
                    <span>{appointment.details.specialty}</span>
                  </div>
                </div>
                <div className={styles.information__contentRow}>
                  <div className={styles.information__data}>
                    <label>Office Address: </label>
                    <span>{appointment.details.officeAddress}</span>
                  </div>
                  <div className={styles.information__data}>
                    <label>Office Number: </label>
                    <span>N/A</span>
                  </div>
                </div>
                {Object.keys(medicalHistory(appointment)).map((key, index) =>
                  <div key={index}
                    className={styles.information__contentRow}>
                    <div className={styles.information__data}>
                      <label>{index + 1}. {convertToTitleCase(key)}</label>
                    </div>
                    <div className={styles.information__data}>
                      <span>{appointment.details[key].toString().toUpperCase()}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>}
          </div>) : <>No Appointments</>}
      </div>
    )
  }

  return (
    <Modal open={open} setOpen={setOpen} modalWidth={700} modalRadius={10}>
      <h3 className={styles.title}>Patient Record</h3>
      <div className={styles.actions}>
        <div onClick={() => setActiveTab('Patient Info')}
          className={`${styles.tab} ${activeTab === 'Patient Info' ? styles.active : ''}`}>Patient Info</div>
        <div onClick={() => setActiveTab('Appointments')}
          className={`${styles.tab} ${activeTab === 'Appointments' ? styles.active : ''}`}>Appointments</div>
        <div className={styles.buttonTab}>
          <Button>Generate Report</Button>
        </div>
      </div>
      {recordInfo &&
        <>
          {activeTab === 'Patient Info' ? renderPatientInfo() : renderAppointments()}
        </>
      }
    </Modal>
  )
}