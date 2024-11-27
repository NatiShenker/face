import React from 'react';

const FaceRecognitionAnimation = ({ isActive }) => {
  if (!isActive) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <svg className="w-64 h-64" viewBox="0 0 100 100">
        {/* Outer circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="#0EA5E9"
          strokeWidth="0.5"
          className="animate-[spin_3s_linear_infinite]"
        />
        
        {/* Scanning line */}
        <line
          x1="10"
          y1="50"
          x2="90"
          y2="50"
          stroke="#0EA5E9"
          strokeWidth="0.5"
          className="animate-[scanning_2s_ease-in-out_infinite]"
        >
          <animate
            attributeName="y1"
            values="20;80;20"
            dur="2s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="y2"
            values="20;80;20"
            dur="2s"
            repeatCount="indefinite"
          />
        </line>
        
        {/* Corner brackets */}
        <path
          d="M20,20 L20,30 M20,20 L30,20"
          stroke="#0EA5E9"
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M80,20 L80,30 M80,20 L70,20"
          stroke="#0EA5E9"
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M20,80 L20,70 M20,80 L30,80"
          stroke="#0EA5E9"
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M80,80 L80,70 M80,80 L70,80"
          stroke="#0EA5E9"
          strokeWidth="2"
          fill="none"
        />
      </svg>
    </div>
  );
};

export default FaceRecognitionAnimation;