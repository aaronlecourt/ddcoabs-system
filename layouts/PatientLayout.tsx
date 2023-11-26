import { ReactNode } from "react";
import Navbar from "../components/Navbar";

export default function PatientLayout({ children }: { children: ReactNode }) {
  const navItems = [
    {
      text: 'Home',
      link: '/'
    },
    {
      text: 'Appointments',
      link: '/appointments'
    },
    {
      text: 'Book Now',
      link: '/book',
      className: 'navbar__item--contained'
    }
  ]

  return (
    <>
      <Navbar items={navItems} />
      {children}
    </>
  )
}