import styles from './style.module.scss'

export default function Modal({ children, title, open, setOpen, modalWidth, modalRadius, onClose, ...props }: any) {
  return (
    <div className={`${styles.modalContainer} ${open ? styles.modalContainerOpen : ''}`} {...props}>
      <div className={styles.modalBackground} onClick={e => onClose ? onClose(e) : setOpen(false)}></div>
      <div className={styles.modal} style={{ width: modalWidth || '80%', borderRadius: modalRadius + 'px' || 0 }}>
        {title && <h1>{title}</h1>}
        {children}
      </div>
    </div>
  )
}