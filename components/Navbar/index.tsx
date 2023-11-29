import Image from 'next/image'
import styles from './style.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { signOut } from 'next-auth/react';
import { useState } from 'react';

interface Item {
  text: string,
  link: string,
  className?: string
}

export default function Navbar({ items = [] }: { items: Item[] }) {
  const [showDropdown, setShowDropdown] = useState(false)

  return (
    <nav className={styles.navbar}>
      <Image 
        className={styles.navbar__logo}
        src='/logo.png'
        alt='logo'
        width={250}
        height={0}
      />
      <div className={styles.navbar__itemContainer}>
        {items.map(item => <a key={item.text} className={`${styles.navbar__item} ${item.className ? styles[item.className] : ''}`} href={item.link}>{item.text}</a>)}
        <div className={styles.navbar__profileContainer} onClick={() => setShowDropdown(!showDropdown)}>
          <div className={styles.navbar__profileIcon}></div>
          <Image 
            src='/caretdown.svg'
            alt='caretdown'
            width={20}
            height={20}
          />
        </div>
      </div>
      <div className={styles.navbar__itemContainerMobile}>
        <FontAwesomeIcon icon={faBars} color={'#fff'} width={30} height={30} />
      </div>
      {showDropdown && 
        <div className={styles.navbar__profileDropdown}>
          <a href='/profile'>Profile</a>
          <a href='/change-password'>Change Password</a>
          <a href='#' onClick={() => signOut()}>Sign Out</a>
        </div>
      }
    </nav>
  )
}