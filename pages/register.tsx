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

    fetch(`/api/patient/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
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
