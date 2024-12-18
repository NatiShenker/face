// src/components/GuardAvatar/GuardAvatar.jsx
import React from 'react';
import { User } from 'lucide-react';
import { CircularProgress } from '../CircularProgress/CircularProgress';

export const GuardAvatar = React.memo(({ guard, onClick }) => {
  console.log('Guard Avatar rendering:', guard); // Debug log

  return (
    <div 
      onClick={onClick} 
      className="relative cursor-pointer group"
      style={{ width: '120px', height: '120px' }} // Explicit size
    >
      <div className="relative w-full h-full">
        {guard.isActive && (
          <div className="absolute inset-0 flex items-center justify-center">
            <CircularProgress percentage={(guard.timeRemaining / 300) * 100} />
          </div>
        )}
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div 
            className={`
              relative w-16 h-16 rounded-full overflow-hidden border-2
              ${guard.isActive ? 'border-blue-500' : 'border-gray-200'}
              transition-all duration-300 ease-in-out
              group-hover:scale-105 group-hover:border-blue-400
              bg-white z-10
            `}
          >
            {guard.photo ? (
              <img 
                src={guard.photo}
                alt={`Guard ${guard.id}`}
                className="w-full h-full object-cover"
                loading="eager"
                key={guard.photo}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100 group-hover:bg-gray-200 transition-colors">
                <User className="w-8 h-8 text-gray-400" />
              </div>
            )}
          </div>
        </div>

        {guard.isActive && (
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-sm font-medium text-gray-600">
            {Math.floor(guard.timeRemaining / 60)}:
            {(guard.timeRemaining % 60).toString().padStart(2, '0')}
          </div>
        )}
      </div>
    </div>
  );
});

GuardAvatar.displayName = 'GuardAvatar';