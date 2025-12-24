import React, { useState, useRef, useEffect } from 'react';
import styles from './SegmentedControl.module.scss';

const SegmentedControl = ({ 
  data = [], 
  value, 
  onChange, 
  defaultValue,
  className 
}) => {
  const [internalValue, setInternalValue] = useState(defaultValue || data[0]?.value);
  const currentValue = value !== undefined ? value : internalValue;
  const containerRef = useRef(null);
  const thumbRef = useRef(null);

  useEffect(() => {
    const updateThumbPosition = () => {
      if (thumbRef.current && containerRef.current && data.length > 0) {
        const activeIndex = data.findIndex(item => item.value === currentValue);
        if (activeIndex !== -1) {
          const containerWidth = containerRef.current.offsetWidth;
          const padding = 4; // padding контейнера
          const segmentWidth = (containerWidth - padding * 2) / data.length;
          const translateX = activeIndex * segmentWidth;
          thumbRef.current.style.width = `${segmentWidth}px`;
          thumbRef.current.style.transform = `translateX(${translateX}px)`;
        }
      }
    };

    updateThumbPosition();
    window.addEventListener('resize', updateThumbPosition);
    
    return () => {
      window.removeEventListener('resize', updateThumbPosition);
    };
  }, [currentValue, data]);

  const handleChange = (newValue) => {
    if (value === undefined) {
      setInternalValue(newValue);
    }
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`${styles.segmentedControl} ${className || ''}`}
    >
      <div ref={thumbRef} className={styles.thumb} />
      {data.map((item) => (
        <button
          key={item.value}
          type="button"
          className={`${styles.segment} ${currentValue === item.value ? styles.active : ''}`}
          onClick={() => handleChange(item.value)}
          disabled={item.disabled}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
};

export default SegmentedControl;

