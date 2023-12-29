import connectMongo from '../utils/connectMongo';
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'
import { signIn } from 'next-auth/react'
import { useRouter } from "next/router";
import { useEffect, useState } from 'react'
import Image from 'next/image'
import styles from '../styles/pages/auth.module.scss';
import pageStyles from '../styles/pages/resetpassword.module.scss';
import Button from '../components/Button';
import AuthLayout from '../layouts/AuthLayout';
import { FormData, ErrorFormData } from '../types/resetpassword';
import { isResetPasswordFormValid } from '../validations/resetpassword';
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
  const { token } = router.query
  const [tokenVerified, setTokenVerified] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    newPassword: '',
    confirmNewPassword: ''
  })

  const [errorFormData, setErrorFormData] = useState<ErrorFormData>({
    newPassword: { error: false, message: null },
    confirmNewPassword: { error: false, message: null },
  })

  useEffect(() => {
    const verifyToken = async () => {
      const response = await fetch(`/api/global/password/reset/${token}`);
      const passwordResetToken = await response.json()
      
      if (passwordResetToken.verified) {
        setTokenVerified(true)
      } else {
        setTokenVerified(false)
        toast.error(`${passwordResetToken.message} Redirecting you now to Home Page ...`)
        setTimeout(() => {
          router.replace('/')
        }, 7000)
      }
    }

      verifyToken()
  }, [ token ]);

 const handleSubmit = async (e: any) => {
    e.preventDefault();
    console.log(tokenVerified)

    try {
      if (tokenVerified) {
        fetch(`/api/global/password/reset`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(Object.assign(formData, { token: token })),
        })
        .then(async (response) => {
          const responseMsg = await response.json()
          if (!response.ok) {
            toast.error('Something went wrong during password reset ' + JSON.stringify(responseMsg))
          } else {
            toast.success('Password reset successful! Redirecting you now to Login Page...')
            setTimeout(() => {
              router.replace('/login')
            }, 7000)
          }
        })  
        .catch(error => {
          console.error('Error password reset:', error);
          toast.error('Something went wrong during password reset')
        })
      } else {
        toast.error('Something went wrong during password reset: Token is invalid.')
      }
    } catch (error) {
      console.log(error)
    }
  }

  const proceed = (e: any) => {
    e.preventDefault();

    if (isResetPasswordFormValid(formData, errorFormData, setErrorFormData)) handleSubmit(e);
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
            <div className={styles.formFieldChild}>
                <label>New Password</label>
                <div className={`formInput ${errorFormData.newPassword.error ? 'formInput--error' : ''}`}>
                  <input type='password'
                    onKeyDown={e => handleFormEnter(e, proceed)}
                    name='newPassword'
                    value={formData.newPassword}
                    onChange={e => handleFormDataChange(e, setFormData, setErrorFormData)}
                    placeholder='••••••••'
                  />
                </div>
                {errorFormData.newPassword.error && <span className='formLabel__errorMessage'>{errorFormData.newPassword.message}</span>}
              </div>
            </div>
            <div className={styles.formField}>
                <label>Confirm New Password</label>
                <div className={`formInput ${errorFormData.confirmNewPassword.error ? 'formInput--error' : ''}`}>
                  <input type='password'
                    onKeyDown={e => handleFormEnter(e, proceed)}
                    name='confirmNewPassword'
                    value={formData.confirmNewPassword}
                    onChange={e => handleFormDataChange(e, setFormData, setErrorFormData)}
                    placeholder='••••••••'
                  />
                </div>
                {errorFormData.confirmNewPassword.error && <span className='formLabel__errorMessage'>{errorFormData.confirmNewPassword.message}</span>}
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
