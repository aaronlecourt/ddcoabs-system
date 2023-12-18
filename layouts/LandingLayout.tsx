import { ReactNode } from "react";
import Navbar from "../components/Navbar";
import styles from '../styles/pages/landing.module.scss';

export default function LandingLayout({ children }: { children: ReactNode }) {
  const navItems = [
    {
      text: 'Sign Up',
      link: '/register'
    },
    {
      text: 'Log In',
      link: '/login'
    }
  ]

  return (
    <>
      <div className={styles.landing}>
        <Navbar items={navItems} />
        {children}
      </div>
    </>
  )
}