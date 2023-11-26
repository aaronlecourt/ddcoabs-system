import Image from 'next/image'
import styles from './style.module.scss'

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
        src='/logo1.svg'
        alt='logo1'
        width={56}
        height={81}
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
    </nav>
  )
}