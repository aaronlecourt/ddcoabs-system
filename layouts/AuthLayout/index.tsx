import { ReactNode } from "react";
import styles from './style.module.scss';

export default function AuthLayout({ children }: { children: ReactNode }) {
  const operatingHours = [
    {
      
    }
  ]

  return (
    <main className={styles.main}>
      <section>
        {children}
      </section>
      <section>
        <div>
          <h1>Operating Hours</h1>
          <div></div>
        </div>
      </section>
    </main>
  )
}