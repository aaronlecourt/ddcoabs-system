import Head from "next/head"

export default function Header({ title }: { title?: string }) {
  const appTitle = title ? `DentalFix | ${title}` : 'DentalFix';

  return (
    <Head>
      <title>{appTitle}</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>  
  )
}