import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'
import connectMongo from '../utils/connectMongo';
import { useEffect, useState } from 'react';
import { getSession } from "next-auth/react"
import styles from '../styles/pages/profile.module.scss'
import PatientLayout from '../layouts/PatientLayout';
import DentistLayout from '../layouts/DentistLayout';
import { FormData, ErrorFormData } from '../types/profile';
import { handleFormDataChange, handleFormEnter } from '../utils/form-handles';
import Button from '../components/Button';
import { isProfileFormValid } from '../validations/profile';
import useAuthGuard from '../guards/auth.guard';

export const getServerSideProps: GetServerSideProps<any> = async (context) => {
  const session = await getSession(context);

  try {
    await connectMongo();

    if (!session) {
      return {
        props: { isConnected: false },
      }
    }

    const user: any = session.user;
    let initialFormData = {}

    if (user) {
      const response = await fetch(`${process.env.NEXTAUTH_URL}/api/global/user/${user?.id}`);
      const data = await response.json();
      console.log('data ', user)

      initialFormData = {
        name: data.name || '',
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth).toISOString().substring(0, 10) : '',
        age: data.age || '',
        email: data.email || '',
        religion: data.religion || '',
        nationality: data.nationality || '',
        sex: data.sex || '',
        bloodType: data.bloodType || '',
        address: data.address || '',
        contactNumber: data.contactNumber || '',
        guardianName: data.guardianName || '',
        guardianContactNumber: data.guardianContactNumber || '',
        guardianIdFile: data.validID || ''
      }
    }

    return {
      props: { isConnected: true, initialFormData: initialFormData },
    }

  } catch (e) {
    console.error(e)
    return {
      props: { isConnected: false },
    }
  }
}

export default function Profile({
  isConnected,
  initialFormData
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { session, status } = useAuthGuard();

  const [formData, setFormData] = useState<FormData>({
    name: '',
    dateOfBirth: '',
    age: '',
    email: '',
    religion: '',
    nationality: '',
    sex: '',
    bloodType: '',
    address: '',
    contactNumber: '',
    guardianName: '',
    guardianContactNumber: '',
    guardianIdFile: ''
  })

  const [errorFormData, setErrorFormData] = useState<ErrorFormData>({
    name: { error: false, message: null },
    dateOfBirth: { error: false, message: null },
    age: { error: false, message: null },
    email: { error: false, message: null },
    religion: { error: false, message: null },
    nationality: { error: false, message: null },
    sex: { error: false, message: null },
    bloodType: { error: false, message: null },
    address: { error: false, message: null },
    contactNumber: { error: false, message: null },
    guardianName: { optional: true, error: false, message: null },
    guardianContactNumber: { optional: true, error: false, message: null },
    guardianIdFile: { optional: true, error: false, message: null }
  })

  useEffect(() => {
    if (session) {
      setErrorFormData({
        name: { error: false, message: null },
        dateOfBirth: { error: false, message: null },
        age: { optional: session.user?.role == 'dentist', error: false, message: null },
        email: { error: false, message: null },
        religion: { optional: session.user?.role == 'dentist', error: false, message: null },
        nationality: { optional: session.user?.role == 'dentist', error: false, message: null },
        sex: { error: false, message: null },
        bloodType: { optional: session.user?.role == 'dentist', error: false, message: null },
        address: { error: false, message: null },
        contactNumber: { error: false, message: null },
        guardianName: { optional: true, error: false, message: null },
        guardianContactNumber: { optional: true, error: false, message: null },
        guardianIdFile: { optional: true, error: false, message: null }
      })
    }
  }, [session])

  const updateProfile = (e: any) => {
    e.preventDefault();

    if (isProfileFormValid(formData, errorFormData, setErrorFormData)) {

      // update user logic
      const user = session.user || {};
      if (user) {
        fetch(`/api/${user.role}/profile/${user.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        })
          .then(async (response) => {
            const responseMsg = await response.json()
            if (!response.ok) {
              alert('Profile update failed: ' + responseMsg)
            } else {              
              alert('user successfully updated');
              console.log('updated user ', responseMsg); // Handle the response from the API
            }
          })
          .catch(error => {
            alert('user update failed');
            console.error('Error updating data:', error);
          });
      }
    };
  }

  useEffect(() => {
    setFormData(initialFormData)
  }, [initialFormData])

  const renderContent = () => {
    return (
      <>
        {session && (
          <main className={styles.main}>
            <h1 className={styles.title}>Hello {session.user?.name}!</h1>
            <p className={styles.subtitle}>You can edit your profile information, change your password, and update your patient record here.</p>
            <div className={styles.information}>
              <div className={styles.information__title}>{session.user?.role == 'patient' ? 'Patient Information Record' : 'Edit Profile Information'}</div>
              <div className={styles.form}>
                <div className={styles.form__row}>
                  <div className={styles.form__row__field}>
                    <div className={`formLabel ${styles.form__row__field__label}`}>
                      <label>Name: </label>
                    </div>
                    <div className={`formInput ${errorFormData.name.error ? 'formInput--error' : ''}`}>
                      {errorFormData.name.error && <span className='formInput__errorMessage'>{errorFormData.name.message}</span>}
                      <input type='text'
                        onKeyDown={e => handleFormEnter(e, updateProfile)}
                        name='name'
                        value={formData.name}
                        onChange={e => handleFormDataChange(e, setFormData, setErrorFormData)}
                      />
                    </div>
                  </div>
                  <div className={styles.form__row__field}>
                    <div className={`formLabel ${styles.form__row__field__label}`}>
                      <label>Date of Birth: </label>
                    </div>
                    <div className={`formInput ${errorFormData.dateOfBirth.error ? 'formInput--error' : ''}`}>
                      {errorFormData.dateOfBirth.error && <span className='formInput__errorMessage'>{errorFormData.dateOfBirth.message}</span>}
                      <input type='date'
                        onKeyDown={e => handleFormEnter(e, updateProfile)}
                        name='dateOfBirth'
                        value={formData.dateOfBirth}
                        onChange={e => handleFormDataChange(e, setFormData, setErrorFormData)}
                      />
                    </div>
                  </div>
                  {session.user?.role == 'patient' && <div className={styles.form__row__field} style={{ flex: 0.3 }}>
                    <div className={`formLabel ${styles.form__row__field__label}`}>
                      <label>Age: </label>
                    </div>
                    <div className={`formInput ${errorFormData.age.error ? 'formInput--error' : ''}`}>
                      {errorFormData.age.error && <span className='formInput__errorMessage'>{errorFormData.age.message}</span>}
                      <input type='text'
                        onKeyDown={e => handleFormEnter(e, updateProfile)}
                        name='age'
                        value={formData.age}
                        onChange={e => handleFormDataChange(e, setFormData, setErrorFormData)}
                      />
                    </div>
                  </div>}
                </div>
                <div className={styles.form__row}>
                  <div className={styles.form__row__field}>
                    <div className={`formLabel ${styles.form__row__field__label}`}>
                      <label>Email: </label>
                    </div>
                    <div className={`formInput ${errorFormData.email.error ? 'formInput--error' : ''}`}>
                      {errorFormData.email.error && <span className='formInput__errorMessage'>{errorFormData.email.message}</span>}
                      <input type='text'
                        onKeyDown={e => handleFormEnter(e, updateProfile)}
                        name='email'
                        value={formData.email}
                        onChange={e => handleFormDataChange(e, setFormData, setErrorFormData)}
                      />
                    </div>
                  </div>
                  {session.user?.role == 'patient' && <div className={styles.form__row__field}>
                    <div className={`formLabel ${styles.form__row__field__label}`}>
                      <label>Religion: </label>
                    </div>
                    <div className={`formInput ${errorFormData.religion.error ? 'formInput--error' : ''}`}>
                      {errorFormData.religion.error && <span className='formInput__errorMessage'>{errorFormData.religion.message}</span>}
                      <input type='text'
                        onKeyDown={e => handleFormEnter(e, updateProfile)}
                        name='religion'
                        value={formData.religion}
                        onChange={e => handleFormDataChange(e, setFormData, setErrorFormData)}
                      />
                    </div>
                  </div>}
                  {session.user?.role == 'patient' && <div className={styles.form__row__field}>
                    <div className={`formLabel ${styles.form__row__field__label}`}>
                      <label>Nationality: </label>
                    </div>
                    <div className={`formInput ${errorFormData.nationality.error ? 'formInput--error' : ''}`}>
                      {errorFormData.nationality.error && <span className='formInput__errorMessage'>{errorFormData.nationality.message}</span>}
                      <input type='text'
                        onKeyDown={e => handleFormEnter(e, updateProfile)}
                        name='nationality'
                        value={formData.nationality}
                        onChange={e => handleFormDataChange(e, setFormData, setErrorFormData)}
                      />
                    </div>
                  </div>}
                  <div className={styles.form__row__field}>
                    <div className={`formLabelColumn ${styles.form__row__field__label}`}>
                      <label style={{ fontWeight: 700 }}>Sex:</label>
                      {errorFormData.sex.error && <span className='formLabel__errorMessage'>{errorFormData.sex.message}</span>}
                    </div>
                    <div className={styles.form__row__field__center}>
                      <input type='radio' name='sex' id='male-sex' className={errorFormData.sex.error ? 'error' : ''} value='M' checked={formData.sex === "M"} onChange={e => handleFormDataChange(e, setFormData, setErrorFormData)} />
                      <label htmlFor='male-sex'>Male</label>
                    </div>
                    <div className={styles.form__row__field__center}>
                      <input type='radio' name='sex' id='female-sex' className={errorFormData.sex.error ? 'error' : ''} value='F' checked={formData.sex === "F"} onChange={e => handleFormDataChange(e, setFormData, setErrorFormData)} />
                      <label htmlFor='female-sex'>Female</label>
                    </div>
                  </div>
                </div>
                <div className={styles.form__row}>
                  {session.user?.role == 'patient' && <div className={styles.form__row__field} style={{ flex: 0.5 }}>
                    <div className={`formLabel ${styles.form__row__field__label}`}>
                      <label>Blood Type: </label>
                    </div>
                    <div className={`formInput ${errorFormData.bloodType.error ? 'formInput--error' : ''}`}>
                      {errorFormData.bloodType.error && <span className='formInput__errorMessage'>{errorFormData.bloodType.message}</span>}
                      <input type='text'
                        onKeyDown={e => handleFormEnter(e, updateProfile)}
                        name='bloodType'
                        value={formData.bloodType}
                        onChange={e => handleFormDataChange(e, setFormData, setErrorFormData)}
                      />
                    </div>
                  </div>}
                  <div className={styles.form__row__field}>
                    <div className={`formLabel ${styles.form__row__field__label}`}>
                      <label>Home Address: </label>
                    </div>
                    <div className={`formInput ${errorFormData.address.error ? 'formInput--error' : ''}`}>
                      {errorFormData.address.error && <span className='formInput__errorMessage'>{errorFormData.address.message}</span>}
                      <input type='text'
                        onKeyDown={e => handleFormEnter(e, updateProfile)}
                        name='address'
                        value={formData.address}
                        onChange={e => handleFormDataChange(e, setFormData, setErrorFormData)}
                      />
                    </div>
                  </div>
                  <div className={styles.form__row__field}>
                    <div className={`formLabel ${styles.form__row__field__label}`}>
                      <label>Contact No.: </label>
                    </div>
                    <div className={`formInput ${errorFormData.contactNumber.error ? 'formInput--error' : ''}`}>
                      {errorFormData.contactNumber.error && <span className='formInput__errorMessage'>{errorFormData.contactNumber.message}</span>}
                      <input type='text'
                        onKeyDown={e => handleFormEnter(e, updateProfile)}
                        name='contactNumber'
                        value={formData.contactNumber}
                        onChange={e => handleFormDataChange(e, setFormData, setErrorFormData)}
                      />
                    </div>
                  </div>
                </div>
                {session.user?.role == 'patient' && <>
                  <hr className={styles.divider} />
                  <div className={styles.form__row}>
                    <div className={styles.minorsTitle}>For Minors:</div>
                  </div>
                  <div className={styles.form__row}>
                    <div className={styles.form__row__field}>
                      <div className={`formLabel ${styles.form__row__field__label}`}>
                        <label>Parent's or Guardian's Name: </label>
                      </div>
                      <div className={`formInput ${errorFormData.guardianName.error ? 'formInput--error' : ''}`}>
                        {errorFormData.guardianName.error && <span className='formInput__errorMessage'>{errorFormData.guardianName.message}</span>}
                        <input type='text'
                          onKeyDown={e => handleFormEnter(e, updateProfile)}
                          name='guardianName'
                          value={formData.guardianName}
                          onChange={e => handleFormDataChange(e, setFormData, setErrorFormData)}
                        />
                      </div>
                    </div>
                    <div className={styles.form__row__field}>
                      <div className={`formLabel ${styles.form__row__field__label}`}>
                        <label>Contact No.: </label>
                      </div>
                      <div className={`formInput ${errorFormData.guardianContactNumber.error ? 'formInput--error' : ''}`}>
                        {errorFormData.guardianContactNumber.error && <span className='formInput__errorMessage'>{errorFormData.guardianContactNumber.message}</span>}
                        <input type='text'
                          onKeyDown={e => handleFormEnter(e, updateProfile)}
                          name='guardianContactNumber'
                          value={formData.guardianContactNumber}
                          onChange={e => handleFormDataChange(e, setFormData, setErrorFormData)}
                        />
                      </div>
                    </div>
                  </div>
                  <div className={styles.form__row}>
                    <div className={styles.form__row__field}>
                      <div className={`formLabel ${styles.form__row__field__label}`}>
                        <label>Upload Valid ID: </label>
                      </div>
                      <div className={`formInput ${errorFormData.guardianIdFile.error ? 'formInput--error' : ''}`}>
                        {errorFormData.guardianIdFile.error && <span className='formInput__errorMessage'>{errorFormData.guardianIdFile.message}</span>}
                        <div className='formInput__file-container'>
                          <div className='formInput__file-button'>File:</div>
                          <span>{formData.guardianIdFile}</span>
                        </div>
                        <input type='file'
                          onKeyDown={e => handleFormEnter(e, updateProfile)}
                          name='guardianIdFile'
                          value={formData.guardianIdFile}
                          onChange={e => handleFormDataChange(e, setFormData, setErrorFormData)}
                        />
                      </div>
                    </div>
                    <div className={styles.form__row__field} style={{ flex: 0.4, justifyContent: 'flex-end' }}>
                      <Button onClick={updateProfile}>Update Profile</Button>
                    </div>
                  </div>
                </>}
                {session.user?.role == 'dentist' && <div className={styles.form__row__field} style={{ flex: 0.4, justifyContent: 'flex-end' }}>
                  <Button onClick={updateProfile}>Update Profile</Button>
                </div>}
              </div>
            </div>
          </main>
        )}
      </>
    )
  }

  return (
    <>
      {(status !== 'loading' && session) && (
        session.user?.role === 'patient' ? (
          <PatientLayout>
            {renderContent()}
          </PatientLayout>
        ) : (
          <DentistLayout>
            {renderContent()}
          </DentistLayout>
        )
      )
      }
    </>
  )
}
