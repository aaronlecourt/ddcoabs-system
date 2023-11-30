import connectMongo from '../utils/connectMongo';
import Image from 'next/image'
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'
import styles from '../styles/pages/auth.module.scss'
import pageStyles from '../styles/pages/register.module.scss'
import Button from '../components/Button';
import { useContext, useState } from 'react';
import { DentalFixContext } from './_app';
import AuthLayout from '../layouts/AuthLayout';
import { isRegistrationFormValid } from '../validations/register';
import { FormData, ErrorFormData } from '../types/register';
import { handleFormDataChange, handleFormEnter } from '../utils/form-handles';
import useAuthGuard from '../guards/auth.guard';

type ConnectionStatus = {
  isConnected: boolean
}

export const getServerSideProps: GetServerSideProps<
  ConnectionStatus
> = async () => {
  try {
    await connectMongo();
    // `await clientPromise` will use the default database passed in the MONGODB_URI
    // However you can use another database (e.g. myDatabase) by replacing the `await clientPromise` with the following code:
    //
    // `const client = await clientPromise`
    // `const db = client.db("myDatabase")`
    //
    // Then you can execute queries against your database like so:
    // db.find({}) or any of the MongoDB Node Driver commands

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
  const { isTermsModalVisible, setIsTermsModalVisible }: any = useContext(DentalFixContext);
  const { session, status } = useAuthGuard();

  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    address: '',
    mobileNumber: '',
    dateOfBirth: '',
    sex: '',
    password: '',
    confirmPassword: ''
  })

  const [errorFormData, setErrorFormData] = useState<ErrorFormData>({
    fullName: { error: false, message: null },
    email: { error: false, message: null },
    address: { error: false, message: null },
    mobileNumber: { error: false, message: null },
    dateOfBirth: { error: false, message: null },
    sex: { error: false, message: null },
    password: { error: false, message: null },
    confirmPassword: { error: false, message: null }
  })

  const proceed = (e: any) => {
    e.preventDefault();

    if (isRegistrationFormValid(formData, errorFormData, setErrorFormData)) setIsTermsModalVisible(true);
  }

  return (
    <>
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
                {errorFormData.fullName.error && <span className='formLabel__errorMessage'>{errorFormData.fullName.message}</span>}
              </div>
              <div className={`formInput ${errorFormData.fullName.error ? 'formInput--error' : ''}`}>
                <input type='text'
                  onKeyDown={e => handleFormEnter(e, proceed)}
                  name='fullName'
                  value={formData.fullName}
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
                {errorFormData.mobileNumber.error && <span className='formLabel__errorMessage'>{errorFormData.mobileNumber.message}</span>}
              </div>
              <div className={`formInput ${errorFormData.mobileNumber.error ? 'formInput--error' : ''}`}>
                <input type='text'
                  onKeyDown={e => handleFormEnter(e, proceed)}
                  name='mobileNumber'
                  value={formData.mobileNumber}
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
                <input type='radio' name='sex' id='male-sex' className={errorFormData.sex.error ? 'error' : ''} value='male' onChange={e => handleFormDataChange(e, setFormData, setErrorFormData)} />
                <label htmlFor='male-sex'>Male</label>
              </div>
              <div className={styles.formFieldRowChild}>
                <input type='radio' name='sex' id='female-sex' className={errorFormData.sex.error ? 'error' : ''} value='female' onChange={e => handleFormDataChange(e, setFormData, setErrorFormData)} />
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
