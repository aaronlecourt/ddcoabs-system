import { ReactNode, useContext, useState } from "react";
import styles from './style.module.scss';
import Modal from "../../components/Modal";
import CheckBox from "../../components/CheckBox";
import Button from "../../components/Button";
import { DentalFixContext } from "../../pages/_app";

export default function AuthLayout({ children }: { children: ReactNode }) {
  const operatingHours = [
    {
      day: 'Mon',
      time: '09:00-18:00'
    },
    {
      day: 'Tue',
      time: '09:00-18:00'
    },
    {
      day: 'Wed',
      time: '09:00-18:00'
    },
    {
      day: 'Thu',
      time: '09:00-18:00'
    },
    {
      day: 'Fri',
      time: '09:00-18:00'
    },
    {
      day: 'Sat',
      time: 'closed'
    },
    {
      day: 'Sun',
      time: 'closed'
    }
  ]

  const [isCheckedTerms, setIsCheckedTerms] = useState(false)
  const { isTermsModalVisible, setIsTermsModalVisible }: any = useContext(DentalFixContext);

  const signup = () => {
    if (!isCheckedTerms) return alert('Please Agree to the Terms & Conditions');

    // TODO: signup post user here
    alert('Signup logic here')
    setIsTermsModalVisible(false)
  }

  return (
    <>
      <Modal title='Terms & Conditions' open={isTermsModalVisible} setOpen={setIsTermsModalVisible}>
        <p>"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum." "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum." "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud.</p>
        <div className={styles.termsAgree}>
          <CheckBox id='agree' value={isCheckedTerms} setValue={setIsCheckedTerms}>
            <span>I agree to the <span className={styles.termsConditionText}>Terms & Condition</span></span>
          </CheckBox>
          <div className={styles.termsAgreeAction}>
            <Button style={{ marginRight: '1rem' }} type='secondary' onClick={() => setIsTermsModalVisible(false)}>Cancel</Button>
            <Button onClick={signup}>Sign up</Button>
          </div>
        </div>
      </Modal>
      <main className={styles.main}>
        <div className={styles.background}></div>
        <section>
          {children}
        </section>
        <section>
          <div className={styles.operatingHours}>
            <div className={styles.operatingHoursHeader}>Operating Hours</div>
            {operatingHours.map(op => 
              <div key={op.day} className={styles.operatingHoursSchedule}>
                <div className={`${styles.operatingHoursDay} ${op.time === 'closed' ? styles.operatingHoursDayClosed : ''}`}>{op.day}</div>
                <div className={styles.operatingHoursTime}>{op.time}</div>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  )
}