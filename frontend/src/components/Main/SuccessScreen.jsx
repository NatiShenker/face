import React from 'react';
import identifySuccess from '../../assets/identify-success.png';

const SuccessScreen = ({ name }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-50 animate-slideIn">
      <div className="relative w-full max-w-[800px] mx-auto px-4">
        <div className="relative aspect-[4/3] w-full flex flex-col items-center">
          <img 
            src={identifySuccess}
            alt="זיהוי הצליח" 
            className="w-full h-full object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default SuccessScreen;