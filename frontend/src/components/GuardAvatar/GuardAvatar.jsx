import React, { memo } from 'react';
import { User } from "lucide-react";

const GuardAvatar = memo(({ guard, onClick, onVerificationNeeded }) => {
  const handleClick = () => {
    if (guard.timeRemaining === 0 && guard.faceId) {
      onVerificationNeeded(guard.id);
    } else {
      onClick(guard.id);
    }
  };

  const getTimerColor = () => {
    if (!guard.isActive) return 'transparent';
    if (guard.timeRemaining <= 10) return 'rgb(239, 68, 68)';
    const blueIntensity = Math.floor((guard.timeRemaining / 60) * 255);
    return `rgb(${255 - blueIntensity}, ${255 - blueIntensity}, 255)`;
  };

  const isFlashing = guard.isActive && guard.timeRemaining <= 10;
  const isDisabled = guard.isAssigned && !guard.faceId;

  return (
    <div 
      className={`
        flex flex-col items-center space-y-2 
        ${isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
      `} 
      onClick={handleClick}
    >
      <div className="relative">
        {/* Timer circle */}
        <svg className="absolute -inset-1 w-36 h-36" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="48"
            fill="none"
            stroke={getTimerColor()}
            strokeWidth="2"
            className={`transition-colors duration-1000 ${isFlashing ? 'animate-pulse' : ''}`}
          />
        </svg>
        
        {/* Avatar */}
        <div className={`
          relative w-32 h-32 rounded-full overflow-hidden 
          flex items-center justify-center bg-gray-100
          ${guard.isActive ? 'ring-2 ring-green-500' : 'ring-2 ring-gray-200'}
        `}>
          {guard.photo ? (
            <img 
              src={guard.photo} 
              alt={guard.name} 
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-16 h-16 text-gray-400" />
          )}
        </div>
      </div>

      <div className="text-center">
        <div className="font-medium">
          {guard.name || `Position ${guard.id}`}
        </div>
        <div className="text-sm text-gray-500">
          {guard.isActive ? `${guard.timeRemaining}s` : 'Inactive'}
        </div>
      </div>
    </div>
  );
});

export default GuardAvatar;