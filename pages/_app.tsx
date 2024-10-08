import App, { AppContext, AppInitialProps, AppProps } from 'next/app'
import { SessionProvider } from "next-auth/react"
import Header from '../components/Header'
import PAGES from '../constants/pages'
import '../styles/globals.scss'
import '../styles/fonts.scss'
import { createContext, useState } from 'react'
 
type AppOwnProps = { pathname: string }

export const DentalFixContext = createContext({})
 
export default function DentalFix({
  Component,
  pageProps: { session, ...pageProps },
  pathname,
}: AppProps & AppOwnProps) {
  const currentPage = PAGES.find(page => page.pathname === pathname);
  const [isTermsModalVisible, setIsTermsModalVisible] = useState(false);

  return (
    <DentalFixContext.Provider value={{ isTermsModalVisible, setIsTermsModalVisible }}>
      <SessionProvider session={session}>
        <Header title={currentPage?.name} />
        <Component {...pageProps} />
      </SessionProvider>
    </DentalFixContext.Provider>
  )
}
 
DentalFix.getInitialProps = async (
  context: AppContext
): Promise<AppOwnProps & AppInitialProps> => {
  const ctx = await App.getInitialProps(context)

  return { ...ctx, pathname: context.ctx.pathname }
}