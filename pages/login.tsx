// import clientPromise from '../lib/mongodb'
import connectMongo from '../utils/connectMongo';
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'
import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from "next/router";
import styles from '../styles/pages/auth.module.scss';
import pageStyles from '../styles/pages/login.module.scss';
import Image from 'next/image'
import Button from '../components/Button';
import pages from '../constants/pages';

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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await signIn('credentials', { email, password, redirect: false })

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
  return (
    // <main>
    //   <h1>Login Page</h1>

    //   <form onSubmit={ handleSubmit }>
    //     <input onChange={(e) => setEmail(e.target.value)} type="text" placeholder="Email"/>
    //     <input onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password"/>
    //     <button>Log In</button>
    //   </form>
    // </main>
    <div className={styles.container}>
      <div className={styles.header}>
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
          <label>Email Address</label>
          <div className='formInput'>
            <input type='text' onChange={e => setEmail(e.target.value)} />
          </div>
        </div>
        <div className={styles.formField}>
          <label>Password</label>
          <div className='formInput'>
            <input type='password' onChange={e => setPassword(e.target.value)} />
          </div>
        </div>
      </div>
      <div className={pageStyles.action}>
        <a href='/reset-password'>Reset Password?</a>
        <Button onClick={handleSubmit}>Proceed</Button>
      </div>
      <div className={pageStyles.signupText}>
        <span>Do not have an existing account?</span>
        <a href='/register'>Sign up here!</a>
      </div>
    </div>
  )
}
