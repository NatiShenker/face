import React from "react";


const CameraModal = ({ 
  isOpen, 
  onClose, 
  videoRef, 
  isCameraReady, 
  isProcessing, 
  error, 
  mode,
  onCapturePhoto, 
  verificationResult,
  countdown,
  children 
}) => {

  if (!isOpen) return null;
  

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 relative z-50">
          <div className="p-4">
            {error && (
              <div className="mb-4 text-red-500">
                {error}
              </div>
            )}

            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full rounded-lg"
              />
              {children}
              
              {/* Countdown Animation */}
              {countdown !== null && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className={`
                    text-6xl font-bold text-white
                    animate-bounce
                    ${countdown === 3 ? 'text-red-500' : ''}
                    ${countdown === 2 ? 'text-yellow-500' : ''}
                    ${countdown === 1 ? 'text-green-500' : ''}
                  `}>
                    {countdown}
                  </div>
                </div>
              )}
            </div>

            {verificationResult && (
              <div className={`mt-4 p-4 rounded-lg ${
                verificationResult.success ? 'bg-green-100' : 'bg-red-100'
              }`}>
                <p className="text-center font-medium">
                  {verificationResult.message}
                </p>
                {verificationResult.photo && (
                  <div className="mt-2">
                    <img 
                      src={verificationResult.photo} 
                      alt="Captured" 
                      className="w-32 h-32 mx-auto rounded-lg object-cover"
                    />
                  </div>
                )}
              </div>
            )}
            
            <button
              onClick={onClose}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CameraModal;