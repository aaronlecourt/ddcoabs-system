import styles from './style.module.scss'

export default function Button({ children, type, ...props }: any) {
  return (
    <div className={`${styles.button} ${type === 'secondary' ? styles.buttonSecondary : ''}`} {...props}>
      {children}
    </div>
  )
}