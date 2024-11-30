import { useState, useEffect } from 'react';

export const useGuardState = () => {
  const [guards, setGuards] = useState([
    { id: 1, photo: null, isActive: false, timeRemaining: 60, name: null, faceId: null, isAssigned: false },
    { id: 2, photo: null, isActive: false, timeRemaining: 60, name: null, faceId: null, isAssigned: false },
    { id: 3, photo: null, isActive: false, timeRemaining: 60, name: null, faceId: null, isAssigned: false },
    { id: 4, photo: null, isActive: false, timeRemaining: 60, name: null, faceId: null, isAssigned: false }
  ]);
  

  useEffect(() => {
    const timer = setInterval(() => {
      setGuards(current =>
        current.map(guard => ({
          ...guard,
          timeRemaining: guard.isActive ? Math.max(0, guard.timeRemaining - 1) : guard.timeRemaining,
          isActive: guard.isActive && guard.timeRemaining > 0
        }))
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const updateGuard = (guardId, updates) => {
    setGuards(current =>
      current.map(guard =>
        guard.id === guardId ? { ...guard, ...updates } : guard
      )
    );
  };

  const isPositionAvailable = (guardId) => {
    const guard = guards.find(g => g.id === guardId);
    // Position is available if:
    // 1. It's not assigned yet (for initial enrollment)
    // 2. OR it's the guard's own assigned position (for verification)
    return !guard.isAssigned || guard.faceId !== null;
  };

  return {
    guards,
    updateGuard,
    isPositionAvailable
  };
};