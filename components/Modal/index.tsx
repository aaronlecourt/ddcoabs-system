import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styles from './style.module.scss'
import { faClose } from '@fortawesome/free-solid-svg-icons'

export default function Modal({ children, title, withCloseButton, open, setOpen, modalWidth, modalHeight, modalRadius, padding, onClose, ...props }: any) {
  return (
    <div className={`${styles.modalContainer} ${open ? styles.modalContainerOpen : ''}`} {...props}>
      <div className={styles.modalBackground} onClick={e => onClose ? onClose(e) : setOpen(false)}></div>
      <div className={styles.modal} style={{ width: modalWidth || '80%', height: modalHeight || 'auto', borderRadius: modalRadius + 'px' || 0, padding: padding || '2rem' }}>
        {withCloseButton && <div className={styles.modalClose} onClick={e => onClose ? onClose(e) : setOpen(false)}>
          <FontAwesomeIcon icon={faClose} width={50} height={50} size='2x' />
        </div>}
        {title && <h1>{title}</h1>}
        {children}
      </div>
    </div>
  )
}