import Head from "next/head"

export default function Header({ title }: { title?: string }) {
  return (
    <Head>
      <title>DentFix{title && ` | ${title}`}</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>  
  )
}