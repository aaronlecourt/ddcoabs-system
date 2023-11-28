import styles from './style.module.scss'

export default function Button({ children, ...props }: any) {
  return (
    <div className={styles.button} {...props}>
      {children}
    </div>
  )
}