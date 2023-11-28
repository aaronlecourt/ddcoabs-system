import styles from './style.module.scss'
import { ReactNode } from 'react';

export default function Button({ children }: { children: ReactNode }) {
  return (
    <div className={styles.button}>
      {children}
    </div>
  )
}