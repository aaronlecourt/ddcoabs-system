import { forwardRef } from "react";
import styles from '../styles/forms/services.module.scss';

const ServicesForm = forwardRef(({ nextStep }: any, ref) => {
  return (
    <div>
      <p>Note: The following charges are all based on the least type of case. Depending on your assessment, the clinic may charge higher whenever deemed necessary.</p>
      <div className={styles.container}>
        <div>
          <ul>
            <li>Plastic (heat cure/lab fabricated)</li>
            <li>PMMA (Polymethy Methacrylate)</li>
            <li>PFM</li>
            <li>PFT (Tilite)</li>
            <li>EMAX</li>
            <li>Zirconia</li>
          </ul>
        </div>
        <div>
          <strong>Concern:</strong>
          <br/>
          <textarea rows={5} cols={50} placeholder="Please indicate here your concern if unsure of the needed service...."/>
        </div>
      </div>
    </div>
  )
})

export default ServicesForm;