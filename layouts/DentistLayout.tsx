import { ReactNode } from "react";
import Navbar from "../components/Navbar";

export default function DentistLayout({ children }: { children: ReactNode }) {
  const navItems = [
    {
      text: 'Home',
      link: '/'
    },
    {
      text: 'User Records',
      link: '/accounts'
    },
    {
      text: 'Appointments',
      link: '/appointments'
    },
    {
      text: 'Services',
      link: '/services'
    },
    {
      text: 'Archives',
      link: '/archives'
    },
    {
      text: 'Walk In',
      link: '/walk-in'
    }
  ]

  return (
    <>
      <Navbar items={navItems} />
      {children}
    </>
  )
}