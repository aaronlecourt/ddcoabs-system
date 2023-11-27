import { ReactNode } from "react";
import styles from './style.module.scss';

export default function AuthLayout({ children }: { children: ReactNode }) {
  const operatingHours = [
    {
      day: 'Mon',
      time: '09:00-18:00'
    },
    {
      day: 'Tue',
      time: '09:00-18:00'
    },
    {
      day: 'Wed',
      time: '09:00-18:00'
    },
    {
      day: 'Thu',
      time: '09:00-18:00'
    },
    {
      day: 'Fri',
      time: '09:00-18:00'
    },
    {
      day: 'Sat',
      time: 'closed'
    },
    {
      day: 'Sun',
      time: 'closed'
    }
  ]

  return (
    <main className={styles.main}>
      <div className={styles.background}></div>
      <section>
        {children}
      </section>
      <section>
        <div className={styles.operatingHours}>
          <div className={styles.operatingHoursHeader}>Operating Hours</div>
          {operatingHours.map(op => 
            <div className={styles.operatingHoursSchedule}>
              <div className={`${styles.operatingHoursDay} ${op.time === 'closed' ? styles.operatingHoursDayClosed : ''}`}>{op.day}</div>
              <div className={styles.operatingHoursTime}>{op.time}</div>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}