import connectMongo from '../utils/connectMongo';
import Image from 'next/image'
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'
import styles from '../styles/pages/auth.module.scss'
import pageStyles from '../styles/pages/register.module.scss'
import Button from '../components/Button';

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
  return (
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
          <div className='formLabel'>
            <label>Full Name</label>
            <span className='formLabel__errorMessage'>error message</span>
          </div>
          <div className='formInput formInput--error'>
            <input type='text' />
          </div>
        </div>
        <div className={styles.formField}>
          <div className='formLabel'>
            <label>Email Address</label>
            <span className='formLabel__errorMessage'>error message</span>
          </div>
          <div className='formInput formInput--error'>
            <input type='text' />
          </div>
        </div>
        <div className={styles.formField}>
          <div className='formLabel'>
            <label>Address</label>
            <span className='formLabel__errorMessage'>error message</span>
          </div>
          <div className='formInput formInput--error'>
            <input type='text' />
          </div>
        </div>
        <div className={styles.formField}>
          <div className='formLabel'>
            <label>Mobile Number</label>
            <span className='formLabel__errorMessage'>error message</span>
          </div>
          <div className='formInput formInput--error'>
            <input type='text' />
          </div>
        </div>
        <div className={styles.formField}>
          <div className='formLabel'>
            <label>Date of Birth</label>
            <span className='formLabel__errorMessage'>error message</span>
          </div>
          <div className='formInput formInput--error'>
            <input type='text' />
          </div>
        </div>
        <div className={styles.formFieldRow}>
          <div className='formLabelColumn'>
            <label style={{ fontWeight: 700 }}>Sex:</label>
            <span className='formLabel__errorMessage'>error message</span>
          </div>
          <div className={styles.formFieldRowChild}>
            <input type='radio' name='sex' id='male-sex' className='error' />
            <label htmlFor='male-sex'>Male</label>
          </div>
          <div className={styles.formFieldRowChild}>
            <input type='radio' name='sex' id='female-sex' className='error' />
            <label htmlFor='female-sex'>Female</label>
          </div>
        </div>
        <div className={styles.formFieldRow}>
          <div className={styles.formFieldChild}>
            <label>Password</label>
            <div className='formInput formInput--error'>
              <input type='password' />
            </div>
            <span className='formLabel__errorMessage'>error message</span>
          </div>
          <div className={styles.formFieldChild}>
            <label>Confirm Password</label>
            <div className='formInput formInput--error'>
              <input type='password' />
            </div>
            <span className='formLabel__errorMessage'>error message</span>
          </div>
        </div>
      </div>
      <p className={pageStyles.loginText}>Already have an existing account? <a href='/login'>Log in here!</a></p>
      <div className={pageStyles.action}>
        <Button>Proceed</Button>
      </div>
    </div>
  )
}
