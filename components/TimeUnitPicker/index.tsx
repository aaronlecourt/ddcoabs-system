// TimeUnitPicker.tsx
import React from 'react';
import styles from './TimeUnitPicker.module.scss'; // Define your styles

interface TimeUnitPickerProps {
  selectedTimeUnit: string;
  onSelectTimeUnit: (timeUnit: string) => void;
}

const TimeUnitPicker: React.FC<TimeUnitPickerProps> = ({ selectedTimeUnit, onSelectTimeUnit }) => {
  return (
    <div className={styles.timeUnit}>
      <div onClick={() => onSelectTimeUnit('AM')} className={selectedTimeUnit === 'AM' ? styles.selected : ''}>
        AM
      </div>
      <div onClick={() => onSelectTimeUnit('PM')} className={selectedTimeUnit === 'PM' ? styles.selected : ''}>
        PM
      </div>
    </div>
  );
};

export default TimeUnitPicker;
