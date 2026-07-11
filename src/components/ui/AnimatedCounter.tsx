import React, { useEffect, useState, useRef } from 'react';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  decimals?: number;
}

export default function AnimatedCounter({ value, duration = 1500, decimals = 0 }: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const prevValue = useRef(0);
  const requestRef = useRef<number | undefined>(undefined);
  const startTimeRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (value === prevValue.current) return;
    
    const startValue = prevValue.current;
    const endValue = value;
    
    const animate = (time: number) => {
      if (!startTimeRef.current) startTimeRef.current = time;
      const progress = Math.min((time - startTimeRef.current) / duration, 1);
      
      // Easing function (easeOutQuart)
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      
      setCount(startValue + (endValue - startValue) * easeProgress);
      
      if (progress < 1) {
        requestRef.current = requestAnimationFrame(animate);
      } else {
        prevValue.current = endValue;
        startTimeRef.current = undefined;
      }
    };
    
    requestRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [value, duration]);

  // Format the output
  let formattedValue = '';
  if (value >= 1000 && count >= 1000 && decimals === 0) {
    // Basic comma formatting for integers over 1000
    formattedValue = Math.floor(count).toLocaleString();
  } else {
    // Standard decimal formatting
    formattedValue = count.toFixed(decimals);
  }

  // Preserve trailing zeros if it's a decimal that was supposed to have them
  if (decimals > 0 && Number.isInteger(count) && count === value) {
     formattedValue = value.toFixed(decimals);
  }
  
  // Quick fix for the "toLocaleString" above: ensure commas are applied to formatted numbers as well
  if (formattedValue.includes('.') && value >= 1000) {
     const parts = formattedValue.split('.');
     parts[0] = parseInt(parts[0]).toLocaleString();
     formattedValue = parts.join('.');
  }

  return <span>{formattedValue}</span>;
}
