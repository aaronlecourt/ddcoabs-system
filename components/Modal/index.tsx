import styles from './style.module.scss'

export default function Modal({ children, title, open, setOpen, ...props }: any) {
  return (
    <div className={`${styles.modalContainer} ${open ? styles.modalContainerOpen : ''}`} {...props}>
      <div className={styles.modal}>
        <h1>{title}</h1>
        {children}
      </div>
    </div>
  )
}