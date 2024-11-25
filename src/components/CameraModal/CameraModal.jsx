import React from 'react';
import { Camera } from 'lucide-react';
import { FaceDetectionIndicator } from '../FaceDetectionIndicator/FaceDetectionIndicator';

export const CameraModal = ({ 
  isOpen, 
  onClose, 
  videoRef,
  isCameraReady,
  countdown,
  processingPhoto,
  detectionResult,
  isDetecting
}) => {
  // Helper function to determine indicator status
  const getIndicatorStatus = () => {
    if (isDetecting) return 'scanning';
    if (detectionResult) {
      return detectionResult.success ? 'success' : 'error';
    }
    return null;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-[520px] shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Security Check-in Photo</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            ✕
          </button>
        </div>
        
        <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden shadow-inner">
          {!isCameraReady && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Camera className="w-8 h-8 text-white animate-pulse" />
            </div>
          )}
          
          {countdown && (
            <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/50 backdrop-blur-sm">
              <span className="text-7xl text-white font-bold animate-bounce">
                {countdown}
              </span>
            </div>
          )}

          {(processingPhoto || detectionResult) && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="text-center">
                <FaceDetectionIndicator status={getIndicatorStatus()} />
                {detectionResult && (
                  <div className={`mt-4 text-lg font-medium ${
                    detectionResult.success ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {detectionResult.message}
                  </div>
                )}
              </div>
            </div>
          )}
          
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};