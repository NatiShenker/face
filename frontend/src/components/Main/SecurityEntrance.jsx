import React, { useState } from 'react';
import SecurityCheckAvatar from './SecurityCheckAvatar';
import securityEntrance from '../../assets/security-entrance.png';

const SecurityEntrance = () => {
  const [showSecurityCheck, setShowSecurityCheck] = useState(false);
  const [isRippling, setIsRippling] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  if (showSecurityCheck) {
    return <SecurityCheckAvatar />;
  }

  const handleClick = () => {
    setIsRippling(true);
    setIsExiting(true);
    
    // Wait for ripple animation
    setTimeout(() => {
      setIsRippling(false);
      // Then trigger the slide transition
      setTimeout(() => {
        setShowSecurityCheck(true);
      }, 300);
    }, 300);
  };

  return (
    <div className={`fixed inset-0 flex items-center justify-center bg-gray-50
      ${isExiting ? 'animate-slideOut' : 'animate-slideIn'}`}>
      <div className="relative">
        <img 
          src={securityEntrance}
          alt="Security Check" 
          className="pointer-events-none"
        />
        <div 
          onClick={handleClick}
          style={{
            width: '22rem',
            height: '5.2rem',
            borderRadius: '13px',
            position: 'absolute',
            bottom: '.5rem',
            left: '51%',
            transform: 'translateX(-50%)',
            cursor: 'pointer',
            overflow: 'hidden', // Important for ripple effect
          }}
          className={`
            relative 
            ${isRippling ? 'after:animate-ripple' : ''} 
            after:absolute 
            after:content-[''] 
            after:bg-white/30 
            after:w-full 
            after:h-full 
            after:top-0 
            after:left-0 
            after:opacity-0
            hover:bg-white/10 
            transition-colors 
            duration-300
          `}
          aria-label="Click to identify"
        />
      </div>
    </div>
  );
};

export default SecurityEntrance;