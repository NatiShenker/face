// src/components/FaceDetectionIndicator/FaceDetectionIndicator.jsx
import React from 'react';

export const FaceDetectionIndicator = ({ status }) => {
  return (
    <div className="relative flex items-center justify-center">
      {/* Outer rotating squares */}
      <div className={`absolute w-32 h-32 ${status === 'scanning' ? 'animate-spin-slow' : ''}`}>
        <div className="absolute top-0 left-0 w-4 h-4 border-2 border-white/80" />
        <div className="absolute top-0 right-0 w-4 h-4 border-2 border-white/80" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-2 border-white/80" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-2 border-white/80" />
      </div>

      {/* Inner frame with animated corners */}
      <div className="relative w-24 h-24">
        {/* Top left corner */}
        <div className={`
          absolute -top-1 -left-1 
          ${status === 'scanning' ? 'animate-corner-pulse' : ''}
          ${status === 'success' ? 'border-green-400' : 'border-white'}
          ${status === 'error' ? 'border-red-400' : ''}
        `}>
          <div className="w-8 h-[2px] bg-current" />
          <div className="w-[2px] h-8 bg-current" />
        </div>

        {/* Top right corner */}
        <div className={`
          absolute -top-1 -right-1 
          ${status === 'scanning' ? 'animate-corner-pulse' : ''}
          ${status === 'success' ? 'border-green-400' : 'border-white'}
          ${status === 'error' ? 'border-red-400' : ''}
        `}>
          <div className="w-8 h-[2px] bg-current" />
          <div className="w-[2px] h-8 bg-current absolute right-0 top-0" />
        </div>

        {/* Bottom left corner */}
        <div className={`
          absolute -bottom-1 -left-1 
          ${status === 'scanning' ? 'animate-corner-pulse' : ''}
          ${status === 'success' ? 'border-green-400' : 'border-white'}
          ${status === 'error' ? 'border-red-400' : ''}
        `}>
          <div className="w-8 h-[2px] bg-current absolute bottom-0 left-0" />
          <div className="w-[2px] h-8 bg-current" />
        </div>

        {/* Bottom right corner */}
        <div className={`
          absolute -bottom-1 -right-1 
          ${status === 'scanning' ? 'animate-corner-pulse' : ''}
          ${status === 'success' ? 'border-green-400' : 'border-white'}
          ${status === 'error' ? 'border-red-400' : ''}
        `}>
          <div className="w-8 h-[2px] bg-current absolute bottom-0 right-0" />
          <div className="w-[2px] h-8 bg-current absolute right-0" />
        </div>

        {/* Scanning line */}
        {status === 'scanning' && (
          <div className="absolute left-0 right-0 h-[2px] bg-white/50 animate-face-scan" />
        )}

        {/* Success icon */}
        {status === 'success' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full border-2 border-green-400 flex items-center justify-center animate-success-pop">
              <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        )}

        {/* Error icon */}
        {status === 'error' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full border-2 border-red-400 flex items-center justify-center animate-error-bounce">
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};