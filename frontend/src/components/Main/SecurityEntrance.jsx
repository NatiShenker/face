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
    
    setTimeout(() => {
      setIsRippling(false);
      setTimeout(() => {
        setShowSecurityCheck(true);
      }, 300);
    }, 300);
  };

  return (
    <div className={`fixed inset-0 flex items-center justify-center bg-gray-50
      ${isExiting ? 'animate-slideOut' : 'animate-slideIn'}`}>
      <div className="relative w-full max-w-[800px] mx-auto px-4">
        <div className="relative aspect-[4/3] w-full">
          <img 
            src={securityEntrance}
            alt="Security Check" 
            className="w-full h-full object-contain pointer-events-none"
          />
          <div 
            onClick={handleClick}
            className={`
              absolute bottom-[8%] left-1/2 -translate-x-1/2
              w-[80%] max-w-[368px] h-20
              rounded-[28px] cursor-pointer overflow-hidden
              ${isRippling ? 'after:animate-ripple' : ''} 
              after:absolute after:content-[''] 
              after:bg-white/20 
              after:w-[120%] 
              after:h-[120%] 
              after:top-1/2 
              after:left-1/2
              after:-translate-x-1/2
              after:-translate-y-1/2 
              after:opacity-0
              transition-transform duration-300
              active:scale-95
            `}
            aria-label="Click to identify"
          />
        </div>
      </div>
    </div>
  );
};

export default SecurityEntrance;