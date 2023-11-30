import styles from './style.module.scss'

export default function Steps({ children, ...props }: any) {
  return (
    <div>
      <div>
        <div>01</div>
        <div>Patient Form</div>
      </div>
      <div>
        <div>02</div>
        <div>Services</div>
      </div>
    </div>
  )
}