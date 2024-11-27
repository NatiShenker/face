import { useState, useEffect, useCallback } from "react";

export const useGuardTimer = (initialGuards) => {
  const [guards, setGuards] = useState(initialGuards.map(guard => ({
    ...guard,
    timeRemaining: guard.isActive ? guard.timeRemaining : 300
  })));

  useEffect(() => {
    const timer = setInterval(() => {
      setGuards(currentGuards => {
        const updatedGuards = currentGuards.map(guard => {
          // Only update guards that are active and have time remaining
          if (!guard.isActive || guard.timeRemaining === 0) {
            return guard; // Return unchanged guard
          }
          return {
            ...guard,
            timeRemaining: Math.max(0, guard.timeRemaining - 1)
          };
        });

        // Check if any actual changes occurred
        const hasChanges = updatedGuards.some(
          (guard, index) => guard.timeRemaining !== currentGuards[index].timeRemaining
        );

        // Only return new array if there are actual changes
        return hasChanges ? updatedGuards : currentGuards;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []); // Empty dependency array since we're using functional updates

  // Memoized setter to prevent unnecessary re-renders
  const setGuardsWithReset = useCallback((updatedGuards) => {
    setGuards(updatedGuards.map(guard => ({
      ...guard,
      timeRemaining: guard.isActive ? guard.timeRemaining : 300
    })));
  }, []);

  return [guards, setGuardsWithReset];
};