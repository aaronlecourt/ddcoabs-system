import {
  Dispatch,
  SetStateAction,
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { handleFormEnter, handleFormDataChange } from "../utils/form-handles";
import styles from "../styles/forms/patient.module.scss";
import { isWalkInPatientFormValid } from "../validations/patientform";
import { BookingFormContextDentist } from "../pages/walk-in";
import Button from "../components/Button";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const PatientWalkIn = {
  patientName: "",
  firstName: "",
  lastName: "",
  age: 0,
  sex: "",
  contactNumber: "",
  guardianName: "",
  guardianNumber: "",
};

export const ErrorPatientFormObjectDentist = {
  firstName: { error: false, message: null },
  lastName: { error: false, message: null },
  age: { error: false, message: null },
  sex: { error: false, message: null },
  contactNumber: { error: false, message: null },
  guardianName: { optional: true, error: false, message: null },
  guardianNumber: { optional: true, error: false, message: null },
};

const BookPatientFormDentist = forwardRef(({}: any, ref) => {
  const [showGuardianNotification, setShowGuardianNotification] = useState(false); //for notif
  const [isAgeInputTouched, setIsAgeInputTouched] = useState(false);

  const {
    patientFormDentist,
    setPatientFormDentist,
    patientErrorFormDataDentist,
    setPatientErrorFormDentist,
    onStepNext,
  }: any = useContext(BookingFormContextDentist);

  const formData = patientFormDentist;
  const setFormData = setPatientFormDentist;
  const errorFormData = patientErrorFormDataDentist;
  const setErrorFormData = setPatientErrorFormDentist;

  const updatePatientName = (e: any) => {
    const { name, value } = e.target;

    setFormData((prevData: any) => ({
      ...prevData,
      [name]: value,
      patientName: `${prevData.firstName} ${prevData.lastName}`,
    }));
    console.log("PATIENT NAME: ", formData.patientName);
  };

  useEffect(() => {}, []);

  useEffect(() => {
    const selectedSex = localStorage.getItem('selectedSex');
    if (selectedSex) {
      setFormData({ ...formData, sex: selectedSex });
    }
  }, []);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const next = (e: any) => {
      e.preventDefault();
    
      // Check if the form is valid
      if (!isWalkInPatientFormValid(formData, errorFormData, setErrorFormData)) {
        // Form is not valid, do not proceed
        return;
      }
    
      // Check if Guardian details are required
      if (isAgeInputTouched && formData.age < 18) {
        setErrorFormData((prevErrors: any) => ({
          ...prevErrors,
          guardianName: {
            ...prevErrors.guardianName,
            optional: false,
            error: !formData.guardianName.trim(),
            message: "Guardian name is required for minors.",
          },
          guardianNumber: {
            ...prevErrors.guardianNumber,
            optional: false,
            error: !formData.guardianNumber.trim(),
            message: "Guardian number is required for minors.",
          },
        }));
    
        // Display toast notification only if it hasn't been shown yet
        if (!showGuardianNotification) {
          setShowGuardianNotification(true);
          toast.error("Guardian details are required for minors.", {
            position: "top-right",
            autoClose: 5000, // 5 seconds
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }

        return;
      }
    
      // If age is 18 or above, make guardian details optional
      setErrorFormData((prevErrors: any) => ({
        ...prevErrors,
        guardianName: {
          ...prevErrors.guardianName,
          optional: true,
          error: false,
          message: null,
        },
        guardianNumber: {
          ...prevErrors.guardianNumber,
          optional: true,
          error: false,
          message: null,
        },
      }));
    
      // Reset the notification flag when the age is updated
      setShowGuardianNotification(false);
    
      // Proceed to the next step
      console.log("Form Data:", formData);
      onStepNext(e);
    };

    // Cleanup the timeout on component unmount or when the effect is re-executed
    return () => clearTimeout(timeoutId);
  }, [formData.age, isAgeInputTouched]);

  const next = (e: any) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    onStepNext(e);
  };

  useImperativeHandle(ref, () => ({
    checkValidForm: () => {
      return isWalkInPatientFormValid(formData, errorFormData, setErrorFormData);
    },
  }));

  return (
    <div className={styles.formContain}>
      <div className={styles.form}>
        <div className={styles.form__row}>
        <div className={styles.form__row__field}>
          <div className={styles.form__row__field__label}>
            <label> First Name: </label>
          </div>
          <div className={styles.form__Input}>
            
            <input
              type="text"
              name="firstName"
              placeholder="Jane or John"
              onChange={(e) => {
                handleFormDataChange(e, setFormData, setErrorFormData);
                updatePatientName(e);
              }}
              value={formData.firstName}
            />
          </div>
        </div>
        <div className={styles.form__row__field}>
          <div className={styles.form__row__field__label}>
            <label> Last Name: </label>
          </div>
          <div className={styles.form__Input}>
            <input
              type="text"
              name="lastName"
              placeholder="Doe"
              onChange={(e) => {
                handleFormDataChange(e, setFormData, setErrorFormData);
                updatePatientName(e);
              }}
              value={formData.lastName}
            />
          </div>
        </div>
        <div className={styles.form__row__field}>
          <div className={styles.form__row__field__label}>
            <label> Age: </label>
          </div>
          <div className={styles.form__Input}>
            <input
              type="text"
              pattern="\d*"
              inputMode="numeric"
              name="age"
              min="0"
              max="150"
              placeholder="Enter age"
              onBlur={() => setIsAgeInputTouched(true)} 
              onChange={(e) => {
                const numericValue = parseInt(e.target.value.replace(/\D/g, ''), 10);
                const clampedValue = Math.min(Math.max(numericValue, 0), 150);
                handleFormDataChange(
                  { target: { name: 'age', value: clampedValue } },
                  setFormData,
                  setErrorFormData
                );
              }}
              value={formData.age ? formData.age.toString() : ''}
            />
          </div>
        </div>
        </div>
        <div className={styles.form__row}>
        <div className={styles.form__row__field}>
          <div className={styles.form__row__field__label}>
            <label> Sex: </label>
          </div>
          <input
            type="radio"
            id="female"
            name="sex"
            value="Female"
            checked={formData.sex === 'Female'}
            onChange={(e) => handleFormDataChange(e, setFormData, setErrorFormData)}
          />
          <label htmlFor="female"> Female </label>
          <input
            type="radio"
            id="male"
            name="sex"
            value="Male"
            checked={formData.sex === 'Male'}
            onChange={(e) => handleFormDataChange(e, setFormData, setErrorFormData)}
          />
          <label htmlFor="male"> Male </label>
        </div>
        <div className={styles.form__row__field}>
          <div className={styles.form__row__field__label}>
            <label> Contact Number: </label>
          </div>
          <div className={styles.form__Input}>
            <input
              type="text"
              placeholder="09123456789"
              name="contactNumber"
              onChange={(e) => handleFormDataChange(e, setFormData, setErrorFormData)}
              value={formData.contactNumber}
            />
          </div>
        </div>
        </div>
        <hr />
        <div className={styles.form__row__field}>
          <div className={styles.form__row__field__label}>
            <label> Parent's or Guardians Name: </label>
          </div>
          <div className={styles.form__Input}>
            <input
              type="text"
              placeholder="N/A"
              onChange={(e) => handleFormDataChange(e, setFormData, setErrorFormData)}
              name="guardianName"
              value={formData.guardianName}
            />
          </div>
        </div>
        <div className={styles.form__row__field}>
          <div className={styles.form__row__field__label}>
            <label> Guardian Contact Number: </label>
          </div>
          <div className={styles.form__Input}>
            <input
              type="text"
              placeholder="09123456789"
              name="guardianNumber"
              onChange={(e) => handleFormDataChange(e, setFormData, setErrorFormData)}
              value={formData.guardianNumber}
            />
          </div>
        </div>
      </div>
      <ToastContainer />
      <div className={styles.next}>
        <Button onClick={next}>Next</Button>
      </div>
    </div>
  );
  
});
export default BookPatientFormDentist;