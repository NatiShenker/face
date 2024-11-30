import { useState } from 'react';

export const useCountdown = () => {
  const [count, setCount] = useState(null);

  const runCountdown = (onComplete) => {
    // Start at 3
    setCount(3);

    // Count down to 2
    setTimeout(() => {
      setCount(2);
      
      // Count down to 1
      setTimeout(() => {
        setCount(1);
        
        // Complete countdown and trigger callback
        setTimeout(() => {
          setCount(null);
          onComplete();
        }, 1000);
      }, 1000);
    }, 1000);
  };

  const resetCountdown = () => {
    setCount(null);
  };

  return {
    count,
    runCountdown,
    resetCountdown
  };
};