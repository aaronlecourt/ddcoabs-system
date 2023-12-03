import styles from './style.module.scss'
import { Dispatch, SetStateAction, forwardRef, useImperativeHandle, useRef } from 'react';

interface Step {
  label: string;
  active: boolean;
  component: any;
}

interface StepsProps {
  steps: Step[];
  setSteps: Dispatch<SetStateAction<Step[]>>;
  currentStep: Step;
  setCurrentStep: Dispatch<SetStateAction<Step>>;
  currentStepIndex: number;
  setCurrentStepIndex: Dispatch<SetStateAction<number>>;
  width?: number;
  onStepNext: (e: any, index: number) => void;
}

const Steps = forwardRef(({ 
  steps, 
  setSteps, 
  currentStep, 
  setCurrentStep, 
  currentStepIndex, 
  setCurrentStepIndex, 
  width,
  onStepNext
}: StepsProps, ref) => {

  const setActiveStep = (e: any, index: number) => {
    e.preventDefault();

    setCurrentStep(steps[index])
    setCurrentStepIndex(index)

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

  const setStep = (e: any, index: number) => {
    onStepNext(e, index)
  }

  useImperativeHandle(ref, () => ({
    setActiveStep
  }))

  return (
    <>
      {steps && steps.length > 0 &&
        <div className={styles.steps} style={{ width: width || '70%' }}>
          {steps.map((step: { label: string, active: boolean }, index) =>
            <div key={step.label} className={styles.steps__step}>
              <div className={styles.step}>
                <div className={`${styles.step__line} ${step.active ? styles.step__lineActive : ''}`}></div>
                <div onClick={e => setStep(e, index)}
                  className={`${styles.step__number} ${step.active ? styles.step__numberActive : ''}`}>0{index + 1}</div>
                <div className={`${styles.step__line} ${steps[index + 1]?.active ? styles.step__lineActive : ''}`}></div>
              </div>
              <div onClick={e => setStep(e, index)}
                className={styles.step__label}>{step.label}</div>
            </div>
          )}
        </div>
      }
    </>

  )
});

export default Steps;