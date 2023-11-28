import styles from './style.module.scss'

export default function CheckBox({ children, id, value, setValue, ...props }: any) {
  return (
    <div className={styles.checkbox} {...props}>
      <input type="checkbox" id={id} checked={value} onChange={e => setValue(e.target.checked)} />
      <label htmlFor={id}>{children}</label>
    </div>
  )
}