import Head from 'next/head'
// import clientPromise from '../lib/mongodb'
import connectMongo from '../utils/connectMongo';
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'
import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from "next/router";

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
    <main>
      <h1>Login Page</h1>

      <form onSubmit={ handleSubmit }>
        <input onChange={(e) => setEmail(e.target.value)} type="text" placeholder="Email"/>
        <input onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password"/>
        <button>Log In</button>
      </form>
    </main>
  )
}
