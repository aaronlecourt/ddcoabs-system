import Head from "next/head"

export default function Header({ title }: { title?: string }) {
  const appTitle = title ? `DentFix | ${title}` : 'DentFix';

  return (
    <Head>
      <title>{appTitle}</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>  
  )
}