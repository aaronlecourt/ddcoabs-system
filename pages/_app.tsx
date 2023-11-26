import App, { AppContext, AppInitialProps, AppProps } from 'next/app'
import PatientLayout from '../layouts/PatientLayout'
import DentistLayout from '../layouts/DentistLayout'
import Header from '../components/Header'
import '../styles/globals.scss'
import '../styles/fonts.scss'
 
type AppOwnProps = { role: 'patient' | 'dentist' | null }
 
export default function DentaFix({
  Component,
  pageProps,
  role
}: AppProps & AppOwnProps) {
  return (
    <>
      <Header />

      {role === 'patient' ? 
        <PatientLayout>
          <Component {...pageProps} />
        </PatientLayout> :

      role === 'dentist' ?
        <DentistLayout>
          <Component {...pageProps} />
        </DentistLayout> :

      <Component {...pageProps} />
      }
    </>
  )
}
 
DentaFix.getInitialProps = async (
  context: AppContext
): Promise<AppOwnProps & AppInitialProps> => {
  const ctx = await App.getInitialProps(context)
 
  // TODO: modify here to check role after login
  return { ...ctx, role: 'patient' }
}