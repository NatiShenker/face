import React, { useState, useEffect } from "react";


export const useGuardTimer = (initialGuards) => {
  const [guards, setGuards] = useState(initialGuards);

  useEffect(() => {
    console.log('Initial guards:', initialGuards); // Debug log

    const timer = setInterval(() => {
      setGuards(currentGuards => {
        const updatedGuards = currentGuards.map(guard => ({
          ...guard,
          timeRemaining: guard.isActive ? 
            Math.max(0, guard.timeRemaining - 1) : 300
        }));
        console.log('Updated guards:', updatedGuards); // Debug log
        return updatedGuards;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return [guards, setGuards];
};