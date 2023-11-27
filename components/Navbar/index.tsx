import Image from 'next/image'
import styles from './style.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

interface Item {
  text: string,
  link: string,
  className?: string
}

export default function Navbar({ items = [] }: { items: Item[] }) {
  return (
    <nav className={styles.navbar}>
      <Image 
        className={styles.navbar__logo}
        src='/logo.png'
        alt='logo'
        width={700}
        height={700}
      />
      <div className={styles.navbar__itemContainer}>
        {items.map(item => <a key={item.text} className={`${styles.navbar__item} ${item.className ? styles[item.className] : ''}`} href={item.link}>{item.text}</a>)}
        <div className={styles.navbar__profileContainer}>
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
    </nav>
  )
}