// useGuardTimer.js (Custom Hook)
import { useState, useEffect } from 'react';

export const useGuardTimer = (initialGuards) => {
  const [guards, setGuards] = useState(initialGuards);

  useEffect(() => {
    const timer = setInterval(() => {
      setGuards(currentGuards => 
        currentGuards.map(guard => ({
          ...guard,
          timeRemaining: guard.isActive ? 
            Math.max(0, guard.timeRemaining - 1) : 300
        }))
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return [guards, setGuards];
};