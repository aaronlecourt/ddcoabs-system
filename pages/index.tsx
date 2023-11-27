import { useRouter } from 'next/router';
import { useEffect } from 'react';
import connectMongo from '../utils/connectMongo';
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'
import styles from '../styles/pages/home.module.scss'
import { signIn, signOut, useSession } from "next-auth/react"

type ConnectionStatus = {
  isConnected: boolean
}

export const getServerSideProps: GetServerSideProps<
  ConnectionStatus
> = async () => {
  try {
    await connectMongo()
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

export default function Home({
  isConnected,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { data: session } = useSession()
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.push('/login');
    }
  }, []); 

  return (
    <>
      {!session && (
        <>
          Not signed in <br />
          <button onClick={() => signIn()}>Sign in</button>
        </>
      )}
      {session && (
        <main className={styles.main}>
          <>
            {/* Signed in as {session.user.email} <br /> */}
            <button onClick={() => signOut()}>Sign out</button>
          </>
          <h1 className={styles.title}>Hello Maria!</h1>
          <p className={styles.subtitle}>You can edit your profile information, change your password, and update your patient record here.</p>
        </main>
      )}
    </>
  )
}
