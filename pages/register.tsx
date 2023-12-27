import connectMongo from '../utils/connectMongo';
import Image from 'next/image'
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'
import styles from '../styles/pages/auth.module.scss'
import pageStyles from '../styles/pages/register.module.scss'
import Button from '../components/Button';
import { useContext, useState } from 'react';
import AuthLayout from '../layouts/AuthLayout';
import { isRegistrationFormValid } from '../validations/register';
import { FormData, ErrorFormData } from '../types/register';
import { handleFormDataChange, handleFormEnter } from '../utils/form-handles';
import useAuthGuard from '../guards/auth.guard';
import Modal from '../components/Modal';
import CheckBox from '../components/CheckBox';
import { useRouter } from 'next/router';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type ConnectionStatus = {
  isConnected: boolean
}

export const getServerSideProps: GetServerSideProps<
  ConnectionStatus
> = async () => {
  try {
    await connectMongo();

    return {
      props: { isConnected: true },
    }
  } catch (e) {
    console.error(e)
    return {
      props: { isConnected: false },
    }
  }
}

export default function Register({
  isConnected,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { session, status } = useAuthGuard();

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    address: '',
    contactNumber: '',
    dateOfBirth: '',
    sex: '',
    password: '',
    confirmPassword: ''
  })

  const [errorFormData, setErrorFormData] = useState<ErrorFormData>({
    name: { error: false, message: null },
    email: { error: false, message: null },
    address: { error: false, message: null },
    contactNumber: { error: false, message: null },
    dateOfBirth: { error: false, message: null },
    sex: { error: false, message: null },
    password: { error: false, message: null },
    confirmPassword: { error: false, message: null }
  })

  const [isCheckedTerms, setIsCheckedTerms] = useState(false)
  const [isTermsModalVisible, setIsTermsModalVisible] = useState(false)

  const proceed = (e: any) => {
    e.preventDefault();
    if (isRegistrationFormValid(formData, errorFormData, setErrorFormData)) setIsTermsModalVisible(true);
  }

  const signup = () => {
    if (!isCheckedTerms) return alert('Please Agree to the Terms & Conditions');

    // Include isArchived in the formData before sending
    const formDataWithArchived = {
      ...formData,
      isArchived: false,
    };

    fetch(`/api/patient/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formDataWithArchived),
    })
      .then(async (response) => {
        const responseMsg = await response.json()
        if (!response.ok) {
          toast.error('Registration failed: ' + JSON.stringify(responseMsg))
        } else {
          const data = responseMsg
          setIsTermsModalVisible(false)
          console.log('registered user ', data); // Handle the response from the API
  
          if (Array.isArray(data)) {
            alert(data[0]);
            if (data[0] === 'Email address already exists') {
              setErrorFormData(prevValue => ({
                ...prevValue,
                ['email']: {
                  error: true,
                  message: data[0]
                }
              }))
            }
          } else {
            toast.success('Registered Successfully!');
            window.location.href = '/login';
          }
        }
      })
      .catch(error => {
        toast.error('user register failed');
        setIsTermsModalVisible(false)
        console.error('Error register data:', error);
      });
  }

  return (
    <>
      <ToastContainer />
      <Modal title='Terms & Conditions' open={isTermsModalVisible} setOpen={setIsTermsModalVisible}>
        <div className={styles.termsScrollable}>
        <div>
        <span className={styles.termsSubHeader}>Welcome to DentFix Dental Clinic Online Appointment Booking System! <br/></span>
        These terms and conditions outline the rules and regulations for the use of our dental appointment booking website.
        </div>
        <br />
        <div>
        By accessing this website and using our appointment booking services, you agree to accept these terms and conditions. Do not continue to use DentFix Dental Clinic 's website if you do not agree to all of the terms and conditions stated on this page.
        </div>
        <br />
        <div>
        <span className={styles.termsSubHeader}>Appointment Booking <br /></span>
        Our website provides a platform for users to schedule appointments with our dental clinic.
        By booking an appointment, you confirm that you are seeking services offered by DentFix Dental Clinic and that the information provided during the booking process is accurate.
        </div>
        <br />
        <div>
          <span className={styles.termsSubHeader}>Payment <br /></span>
          Payment information is collected solely to secure your appointment and will not be charged until services are rendered.
          We accept various forms of payment including cash and Gcash. The payment method provided during booking will be used to secure the appointment.
          No charges will be made until services are provided, and the payment method will only be charged according to the services rendered or any cancellation policy in effect.
        </div>
        <br />
        <div>
          <span className={styles.termsSubHeader}>Cancellation and Rescheduling <br /></span>
          If you need to cancel or reschedule your appointment, please do so at least 48 hours before the scheduled time.
          DentFix Dental Clinic reserves the right to cancel or reschedule appointments due to unforeseen circumstances. In such cases, reasonable efforts will be made to accommodate your schedule.
        </div>
        <br />
        <div>
          <span className={styles.termsSubHeader}>User Responsibilities <br /></span>
          Users are solely responsible for maintaining the confidentiality of their login information and credentials used for accessing the DentFix Dental Clinic Online Appointment Booking System. This includes but is not limited to emails, passwords, or any other authentication details. Users must not share their login credentials with any third party or allow unauthorized access to their account.
        </div>
        <br />
        <div>
          <span className={styles.termsSubHeader}>Data Protection and Privacy <br /></span>
          We are committed to protecting your privacy and personal information. Any data collected during the appointment booking process will be handled in accordance with our Privacy Policy.
        </div>
        <br />
        <div>
          <span className={styles.termsSubHeader}>Liability <br /></span>
          DentFix Dental Clinic is not liable for any damages or losses incurred as a result of using our website or services.
          While we strive to provide accurate information on our website, we cannot guarantee the accuracy, completeness, or suitability of the information provided. It is your responsibility to verify any information provided.
        </div>
        <br />
        <div>
          <span className={styles.termsSubHeader}>Changes to Terms and Conditions <br /></span>
          DentFix Dental Clinic reserves the right to update or modify these terms and conditions at any time without prior notice. Changes will be effective immediately upon posting on the website.
        </div>
        <br />
        <div>
          <span className={styles.termsSubHeader}>Contact Information <br /></span>
          If you have any questions or concerns regarding these terms and conditions, please contact us at 09774270371
          By using our website and booking appointments through our platform, you agree to abide by these terms and conditions.
        </div>
        </div>
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
      {(status !== 'loading' && !session) && <AuthLayout>
        <div className={styles.container}>
          <div className={styles.header}>
            <Image
              className={styles.headerLogo}
              src='/logo.png'
              alt='logo'
              width={350}
              height={90}
            />
          </div>
          <div className={styles.form}>
            <div className={styles.formField}>
              <div className='formLabel'>
                <label>Full Name</label>
                {errorFormData.name.error && <span className='formLabel__errorMessage'>{errorFormData.name.message}</span>}
              </div>
              <div className={`formInput ${errorFormData.name.error ? 'formInput--error' : ''}`}>
                <input type='text'
                  onKeyDown={e => handleFormEnter(e, proceed)}
                  name='name'
                  value={formData.name}
                  onChange={e => handleFormDataChange(e, setFormData, setErrorFormData)}
                  placeholder='Matt Baker'
                />
              </div>
            </div>
            <div className={styles.formField}>
              <div className='formLabel'>
                <label>Email Address</label>
                {errorFormData.email.error && <span className='formLabel__errorMessage'>{errorFormData.email.message}</span>}
              </div>
              <div className={`formInput ${errorFormData.email.error ? 'formInput--error' : ''}`}>
                <input type='text'
                  onKeyDown={e => handleFormEnter(e, proceed)}
                  name='email'
                  value={formData.email}
                  onChange={e => handleFormDataChange(e, setFormData, setErrorFormData)}
                  placeholder='mattbaker@email.com'
                />
              </div>
            </div>
            <div className={styles.formField}>
              <div className='formLabel'>
                <label>Address</label>
                {errorFormData.address.error && <span className='formLabel__errorMessage'>{errorFormData.address.message}</span>}
              </div>
              <div className={`formInput ${errorFormData.address.error ? 'formInput--error' : ''}`}>
                <input type='text'
                  onKeyDown={e => handleFormEnter(e, proceed)}
                  name='address'
                  value={formData.address}
                  onChange={e => handleFormDataChange(e, setFormData, setErrorFormData)}
                  placeholder='123 Street, City, Province'
                />
              </div>
            </div>
            <div className={styles.formField}>
              <div className='formLabel'>
                <label>Mobile Number</label>
                {errorFormData.contactNumber.error && <span className='formLabel__errorMessage'>{errorFormData.contactNumber.message}</span>}
              </div>
              <div className={`formInput ${errorFormData.contactNumber.error ? 'formInput--error' : ''}`}>
                <input type='text'
                  onKeyDown={e => handleFormEnter(e, proceed)}
                  name='contactNumber'
                  value={formData.contactNumber}
                  onChange={e => handleFormDataChange(e, setFormData, setErrorFormData)}
                  placeholder='09123456789'
                />
              </div>
            </div>
            <div className={styles.formField}>
              <div className='formLabel'>
                <label>Date of Birth</label>
                {errorFormData.dateOfBirth.error && <span className='formLabel__errorMessage'>{errorFormData.dateOfBirth.message}</span>}
              </div>
              <div className={`formInput ${errorFormData.dateOfBirth.error ? 'formInput--error' : ''}`}>
                <input type='date'
                  onKeyDown={e => handleFormEnter(e, proceed)}
                  name='dateOfBirth'
                  value={formData.dateOfBirth}
                  onChange={e => handleFormDataChange(e, setFormData, setErrorFormData)}
                />
              </div>
            </div>
            <div className={styles.formFieldRow}>
              <div className='formLabelColumn'>
                <label style={{ fontWeight: 700 }}>Sex:</label>
                {errorFormData.sex.error && <span className='formLabel__errorMessage'>{errorFormData.sex.message}</span>}
              </div>
              <div className={styles.formFieldRowChild}>
                <input type='radio' name='sex' id='male-sex' className={errorFormData.sex.error ? 'error' : ''} value='M' onChange={e => handleFormDataChange(e, setFormData, setErrorFormData)} />
                <label htmlFor='male-sex'>Male</label>
              </div>
              <div className={styles.formFieldRowChild}>
                <input type='radio' name='sex' id='female-sex' className={errorFormData.sex.error ? 'error' : ''} value='F' onChange={e => handleFormDataChange(e, setFormData, setErrorFormData)} />
                <label htmlFor='female-sex'>Female</label>
              </div>
            </div>
            <div className={styles.formFieldRow}>
              <div className={styles.formFieldChild}>
                <label>Password</label>
                <div className={`formInput ${errorFormData.password.error ? 'formInput--error' : ''}`}>
                  <input type='password'
                    onKeyDown={e => handleFormEnter(e, proceed)}
                    name='password'
                    value={formData.password}
                    onChange={e => handleFormDataChange(e, setFormData, setErrorFormData)}
                    placeholder='••••••••'
                  />
                </div>
                {errorFormData.password.error && <span className='formLabel__errorMessage'>{errorFormData.password.message}</span>}
              </div>
              <div className={styles.formFieldChild}>
                <label>Confirm Password</label>
                <div className={`formInput ${errorFormData.confirmPassword.error ? 'formInput--error' : ''}`}>
                  <input type='password'
                    onKeyDown={e => handleFormEnter(e, proceed)}
                    name='confirmPassword'
                    value={formData.confirmPassword}
                    onChange={e => handleFormDataChange(e, setFormData, setErrorFormData)}
                    placeholder='••••••••'
                  />
                </div>
                {errorFormData.confirmPassword.error && <span className='formLabel__errorMessage'>{errorFormData.confirmPassword.message}</span>}
              </div>
            </div>
          </div>
          <p className={pageStyles.loginText}>Already have an existing account? <a href='/login'>Log in here!</a></p>
          <div className={pageStyles.action}>
            <Button onClick={proceed}>Proceed</Button>
          </div>
        </div>
      </AuthLayout>}
    </>
  )
}
