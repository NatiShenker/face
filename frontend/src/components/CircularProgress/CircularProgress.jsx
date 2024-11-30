import React from 'react';

export const CircularProgress = ({ percentage }) => {
  const size = 80; // Reduced from 88
  const strokeWidth = 3;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;
  
  const getColor = (percent) => {
    if (percent > 60) return 'rgb(59, 130, 246)';
    if (percent > 30) return 'rgb(37, 99, 235)';
    return 'rgb(239, 68, 68)';
  };

  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="#e5e7eb"
        strokeWidth={strokeWidth}
        fill="none"
        className="opacity-25"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={getColor(percentage)}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        fill="none"
        className={`transition-all duration-300 ${percentage <= 30 ? "animate-pulse" : ""}`}
      />
    </svg>
  );
};