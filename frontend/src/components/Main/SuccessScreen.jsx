import React from 'react';

const SuccessScreen = ({ name }) => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-50 animate-slideIn">
      <div className="text-center space-y-6">
        <img 
          src="/success-check.png" 
          alt="Success" 
          className="w-32 h-32 mx-auto animate-scaleIn"
        />
        <h2 className="text-2xl font-semibold mt-4 animate-fadeIn">
          {name ? `זוהה, נתן שנקר` : 'Success!'}
        </h2>
        <p className="text-gray-600 animate-fadeIn">
          המשיך בערבות במשמרת:)
        </p>
      </div>
    </div>
  );
};


export default SuccessScreen;