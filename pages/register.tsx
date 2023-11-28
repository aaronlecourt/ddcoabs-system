import connectMongo from '../utils/connectMongo';
import Image from 'next/image'
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'
import styles from '../styles/pages/register.module.scss'
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
          <label>Full Name</label>
          <div className={styles.formInput}>
            <input type='text' />
          </div>
        </div>
        <div className={styles.formField}>
          <label>Email Address</label>
          <div className={styles.formInput}>
            <input type='text' />
          </div>
        </div>
        <div className={styles.formField}>
          <label>Address</label>
          <div className={styles.formInput}>
            <input type='text' />
          </div>
        </div>
        <div className={styles.formField}>
          <label>Mobile Number</label>
          <div className={styles.formInput}>
            <input type='text' />
          </div>
        </div>
        <div className={styles.formField}>
          <label>Date of Birth</label>
          <div className={styles.formInput}>
            <input type='text' />
          </div>
        </div>
        <div className={styles.formFieldRow}>
          <div className={styles.formFieldRowChild}><label style={{ fontWeight: 700 }}>Sex:</label></div>
          <div className={styles.formFieldRowChild}>
            <input type='radio' name='sex' id='male-sex' />
            <label htmlFor='male-sex'>Male</label>
          </div>
          <div className={styles.formFieldRowChild}>
            <input type='radio' name='sex' id='female-sex' />
            <label htmlFor='female-sex'>Female</label>
          </div>
        </div>
        <div className={styles.formFieldRow}>
          <div className={styles.formFieldChild}>
            <label>Password</label>
            <div className={styles.formInput}>
              <input type='text' />
            </div>
          </div>
          <div className={styles.formFieldChild}>
            <label>Confirm Password</label>
            <div className={styles.formInput}>
              <input type='text' />
            </div>
          </div>
        </div>
      </div>
      <p className={styles.loginText}>Already have an existing account? <a href='/login'>Log in here!</a></p>
      <div className={styles.action}>
        <Button>Proceed</Button>
      </div>
    </div>
  )
}
