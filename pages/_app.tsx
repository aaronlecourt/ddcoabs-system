import App, { AppContext, AppInitialProps, AppProps } from 'next/app'
import { SessionProvider } from "next-auth/react"
import PatientLayout from '../layouts/PatientLayout'
import DentistLayout from '../layouts/DentistLayout'
import Header from '../components/Header'
import PAGES from '../constants/pages'
import '../styles/globals.scss'
import '../styles/fonts.scss'
import AuthLayout from '../layouts/AuthLayout'
 
type AppOwnProps = { role: 'patient' | 'dentist' | null, pathname: string }
 
export default function DentalFix({
  Component,
  pageProps: { session, ...pageProps },
  pathname,
  role
}: AppProps & AppOwnProps) {
  const currentPage = PAGES.find(page => page.pathname === pathname);

  return (
    <SessionProvider session={session}>
      <Header title={currentPage?.name} />

      {role === 'patient' ? 
        <PatientLayout>
          <Component {...pageProps} />
        </PatientLayout> :

      role === 'dentist' ?
        <DentistLayout>
          <Component {...pageProps} />
        </DentistLayout> :

        <AuthLayout>
          <Component {...pageProps} />
        </AuthLayout>
      }
    </SessionProvider>
  )
}
 
DentalFix.getInitialProps = async (
  context: AppContext
): Promise<AppOwnProps & AppInitialProps> => {
  const ctx = await App.getInitialProps(context)

  // TODO: modify here to check role after login
  return { ...ctx, role: null, pathname: context.ctx.pathname }
}