import styles from './style.module.scss'
import { Dispatch, SetStateAction } from 'react';

interface Step {
  label: string;
  active: boolean;
  component: any;
}

interface StepsProps {
  steps: Step[];
  setSteps: Dispatch<SetStateAction<Step[]>>;
  setCurrentStep: Dispatch<SetStateAction<Step>>;
  width?: number;
}

export default function Steps({ steps, setSteps, setCurrentStep, width }: StepsProps) {

  const setActiveStep = (e: any, index: number) => {
    e.preventDefault();

    setCurrentStep(steps[index])

    setSteps((prevSteps) => {
      const updatedSteps = prevSteps.map((step: Step, i: number) => {
        if (i <= index) {
          return { ...step, active: true }
        } else {
          return { ...step, active: false }
        }
      })
      return updatedSteps;
    })
  }

  return (
    <>
      {steps && steps.length > 0 &&
        <div className={styles.steps} style={{ width: width || '70%' }}>
          {steps.map((step: { label: string, active: boolean }, index) =>
            <div key={step.label} className={styles.steps__step}>
              <div className={styles.step}>
                <div className={`${styles.step__line} ${step.active ? styles.step__lineActive : ''}`}></div>
                <div onClick={e => setActiveStep(e, index)}
                  className={`${styles.step__number} ${step.active ? styles.step__numberActive : ''}`}>0{index + 1}</div>
                <div className={`${styles.step__line} ${steps[index + 1]?.active ? styles.step__lineActive : ''}`}></div>
              </div>
              <div onClick={e => setActiveStep(e, index)}
                className={styles.step__label}>{step.label}</div>
            </div>
          )}
        </div>
      }
    </>

  )
}