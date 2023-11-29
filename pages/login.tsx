// import clientPromise from '../lib/mongodb'
import connectMongo from '../utils/connectMongo';
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'
import { signIn, useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter } from "next/router";
import styles from '../styles/pages/auth.module.scss';
import pageStyles from '../styles/pages/login.module.scss';
import Image from 'next/image'
import Button from '../components/Button';
import AuthLayout from '../layouts/AuthLayout';
import { FormData, ErrorFormData } from '../types/login';
import { isLoginFormValid } from '../validations/login';
import { handleFormDataChange, handleFormEnter } from '../utils/form-handles';

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

export default function Login({
  isConnected,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { data: session } = useSession()
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
  })

  const [errorFormData, setErrorFormData] = useState<ErrorFormData>({
    email: { error: false, message: null },
    password: { error: false, message: null },
  })
  const router = useRouter();

  useEffect(() => {
    if (session && session.user) router.replace('/');
  }, [session])

  const handleKeyDown = (e: any) => {
    if (e.key === 'Enter') {
      handleSubmit(e)
    }
  }
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const { email, password } = formData;
      const res: any = await signIn('credentials', { email, password, redirect: false })

      if (res.error) {
        console.log(res.error);
        return;
      }

      console.log(res, 'logged in!');
      router.replace('/');
    } catch (error) {
      console.log(error)
    }
  }

  const proceed = (e: any) => {
    e.preventDefault();

    if (isLoginFormValid(formData, setErrorFormData)) handleSubmit(e);
  }

  return (
    <AuthLayout>
      <div className={styles.container}>
        <div className={styles.header} style={{ marginBottom: '5rem' }}>
          <Image
            className={styles.headerLogo}
            src='/logo.png'
            alt='logo'
            width={700}
            height={700}
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
              />
            </div>
          </div>
          <div className={styles.formField}>
            <div className='formLabel'>
              <label>Password</label>
              {errorFormData.password.error && <span className='formLabel__errorMessage'>{errorFormData.password.message}</span>}
            </div>
            <div className={`formInput ${errorFormData.password.error ? 'formInput--error' : ''}`}>
              <input type='password'
                onKeyDown={e => handleFormEnter(e, proceed)}
                name='password'
                value={formData.password}
                onChange={e => handleFormDataChange(e, setFormData, setErrorFormData)}
              />
            </div>
          </div>
        </div>
        <div className={pageStyles.action}>
          <a href='/reset-password'>Reset Password?</a>
          <Button onClick={proceed}>Proceed</Button>
        </div>
        <div className={pageStyles.signupText}>
          <span>Do not have an existing account?</span>
          <br />
          <a href='/register'>Sign up here!</a>
        </div>
      </div>
    </AuthLayout>
  )
}
