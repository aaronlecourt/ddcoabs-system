import connectMongo from '../utils/connectMongo';
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'
import { signIn } from 'next-auth/react'
import { useRouter } from "next/router";
import { useState } from 'react'
import Image from 'next/image'
import styles from '../styles/pages/auth.module.scss';
import pageStyles from '../styles/pages/forgotpassword.module.scss';
import Button from '../components/Button';
import AuthLayout from '../layouts/AuthLayout';
import { FormData, ErrorFormData } from '../types/forgotpassword';
import { isForgotPasswordFormValid } from '../validations/forgotpassword';
import { handleFormDataChange, handleFormEnter } from '../utils/form-handles';
import useAuthGuard from '../guards/auth.guard';
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

export default function ForgotPassword({
  isConnected,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { session, status } = useAuthGuard();
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    email: '',
  })

  const [errorFormData, setErrorFormData] = useState<ErrorFormData>({
    email: { error: false, message: null },
  })

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      fetch(`/api/global/password/forgot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
        .then(async (response) => {
          const responseMsg = await response.json()
          if (!response.ok) {
            toast.error('Error ' + JSON.stringify(responseMsg))
          } else {
            const data = responseMsg
            console.log('response ', data); // Handle the response from the API
            toast.success(data.message + 'You may now close this tab. Please check your email.')
          }
        })
        .catch(error => {
          toast.error('Something went wrong. ' + error);
        });

    } catch (error) {
      console.log(error)
    }
  }

  const proceed = (e: any) => {
    e.preventDefault();

    if (isForgotPasswordFormValid(formData, errorFormData, setErrorFormData)) handleSubmit(e);
  }

  return (
    <>
      <ToastContainer />
      {(status !== 'loading' && !session) && <AuthLayout>
        <div className={styles.container}>
          <div className={styles.header} style={{ marginBottom: '5rem' }}>
            <Image
              className={styles.headerLogo}
              src='/logo.png'
              alt='logo'
              width={300}
              height={90}
            />
          </div>
          <div className={styles.form}>
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
          </div>
          <div className={pageStyles.action}>
            <Button onClick={proceed}>Proceed</Button>
          </div>
        </div>
      </AuthLayout>}
    </>
  )
}
