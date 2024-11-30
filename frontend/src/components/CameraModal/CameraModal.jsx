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
    <div className="absolute inset-0 z-50 overflow-y-auto flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      <div className="relative w-[75%] h-[75%] flex items-center justify-center">
        <div className="bg-white w-full h-full rounded-[20px] overflow-hidden relative shadow-xl">
          {error && (
            <div className="absolute top-0 left-0 right-0 p-3 bg-red-100/90 text-red-500 text-center text-sm z-20">
              {error}
            </div>
          )}

          <div className="relative h-full bg-black">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />
            {children}
            
            {countdown !== null && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className={`
                  text-5xl font-bold text-white
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
            <div className="absolute bottom-4 left-4 right-4">
              <div className={`p-3 rounded-lg ${
                verificationResult.success ? 'bg-green-100/90' : 'bg-red-100/90'
              }`}>
                <p className="text-center font-medium text-sm">
                  {verificationResult.message}
                </p>
                {verificationResult.photo && (
                  <div className="mt-2">
                    <img 
                      src={verificationResult.photo} 
                      alt="Captured" 
                      className="w-20 h-20 mx-auto rounded-lg object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          )}
          
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-white hover:text-gray-200 bg-black/20 rounded-full p-1.5 backdrop-blur-sm"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
};

export default CameraModal;